import { NextRequest, NextResponse } from 'next/server'

/**
 * Moth speaks the Anthropic Messages format. Two upstreams accept it:
 *   1. DeepSeek's Anthropic-compatible endpoint (cheapest, used first when DEEPSEEK_API_KEY is set)
 *   2. Anthropic itself (Haiku), used when DeepSeek is not configured or fails
 */
const DEEPSEEK_URL = 'https://api.deepseek.com/anthropic/v1/messages'
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

const DEEPSEEK_DEFAULT = 'deepseek-flash'
/** Moth defaults to Haiku for cost; Sonnet/Opus are only used if explicitly allowed. */
const HAIKU_DEFAULT = 'claude-haiku-4-5-20251001'

const TIMEOUT_MS = 60_000

type Upstream = { name: 'deepseek' | 'anthropic'; url: string; key: string; model: string }

function resolveAnthropicModel(bodyRecord: Record<string, unknown>): string {
  const allowPremium =
    process.env.ANTHROPIC_ALLOW_SONNET === 'true' ||
    process.env.ANTHROPIC_ALLOW_PREMIUM_MODELS === 'true'
  const envFallback = process.env.ANTHROPIC_MODEL?.trim()
  const fromBody = typeof bodyRecord.model === 'string' ? bodyRecord.model.trim() : ''
  let m = fromBody || envFallback || HAIKU_DEFAULT
  if (!allowPremium && /\b(sonnet|opus)\b/i.test(m)) {
    m = HAIKU_DEFAULT
  }
  return m
}

function upstreams(bodyRecord: Record<string, unknown>): Upstream[] {
  const list: Upstream[] = []
  const deepseekKey = process.env.DEEPSEEK_API_KEY?.trim()
  if (deepseekKey) {
    list.push({
      name: 'deepseek',
      url: DEEPSEEK_URL,
      key: deepseekKey,
      model: process.env.DEEPSEEK_MODEL?.trim() || DEEPSEEK_DEFAULT,
    })
  }
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim()
  if (anthropicKey) {
    list.push({ name: 'anthropic', url: ANTHROPIC_URL, key: anthropicKey, model: resolveAnthropicModel(bodyRecord) })
  }
  return list
}

/** Worth trying again (or on the next upstream): rate limits, overload, server errors. */
function retryable(status: number): boolean {
  return status === 408 || status === 409 || status === 429 || status >= 500
}

/** Keep only text blocks first so the client's content[0].text is always the answer. */
function textFirst(raw: string): string {
  try {
    const data = JSON.parse(raw)
    if (Array.isArray(data?.content)) {
      const text = data.content.filter((b: { type?: string }) => b?.type === 'text')
      const rest = data.content.filter((b: { type?: string }) => b?.type !== 'text')
      data.content = [...text, ...rest]
      return JSON.stringify(data)
    }
  } catch {
    // not JSON, pass through untouched
  }
  return raw
}

async function send(up: Upstream, bodyRecord: Record<string, unknown>) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(up.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': up.key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ ...bodyRecord, model: up.model }),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

/** Safe status for the moth UI — never expose the keys. */
export async function GET() {
  return NextResponse.json({
    apiKeyConfigured: Boolean(process.env.DEEPSEEK_API_KEY?.trim() || process.env.ANTHROPIC_API_KEY?.trim()),
    provider: process.env.DEEPSEEK_API_KEY?.trim() ? 'deepseek' : process.env.ANTHROPIC_API_KEY?.trim() ? 'anthropic' : null,
  })
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: { message: 'Invalid JSON body' } }, { status: 400 })
  }

  const bodyRecord =
    typeof body === 'object' && body !== null && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null
  if (!bodyRecord) {
    return NextResponse.json({ error: { message: 'Request body must be a JSON object' } }, { status: 400 })
  }

  const targets = upstreams(bodyRecord)
  if (!targets.length) {
    return NextResponse.json(
      { error: { message: 'No API key set. Add DEEPSEEK_API_KEY (or ANTHROPIC_API_KEY) to .env.local and restart the dev server.' } },
      { status: 500 },
    )
  }

  let lastStatus = 502
  let lastText = JSON.stringify({ error: { message: 'All model providers failed' } })

  // Each upstream gets two tries; a non-retryable error (bad request, bad key) moves straight on.
  for (const up of targets) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await send(up, bodyRecord)
        const text = await res.text()
        if (res.ok) {
          return new NextResponse(textFirst(text), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'x-moth-provider': up.name },
          })
        }
        lastStatus = res.status
        lastText = text
        if (!retryable(res.status)) break
      } catch (err) {
        lastStatus = 504
        lastText = JSON.stringify({ error: { message: `${up.name} request failed: ${String((err as Error)?.message || err)}` } })
      }
      if (attempt === 0) await new Promise((r) => setTimeout(r, 800))
    }
  }

  return new NextResponse(lastText, {
    status: lastStatus,
    headers: { 'Content-Type': 'application/json' },
  })
}
