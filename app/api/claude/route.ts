import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

/** Moth defaults to Haiku for cost; Sonnet/Opus are only used if explicitly allowed. */
const HAIKU_DEFAULT = 'claude-haiku-4-5-20251001'

function resolveOutgoingModel(bodyRecord: Record<string, unknown>): string {
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

/** Safe status for the moth UI — never expose the key. */
export async function GET() {
  return NextResponse.json({
    apiKeyConfigured: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
  })
}

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY?.trim()
  if (!key) {
    return NextResponse.json(
      { error: { message: 'ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and restart the dev server.' } },
      { status: 500 },
    )
  }

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

  const hasRequestModel = typeof bodyRecord.model === 'string' && bodyRecord.model.trim().length > 0
  const modelOverride = process.env.ANTHROPIC_MODEL?.trim()
  const withModel = hasRequestModel
    ? bodyRecord
    : modelOverride
      ? { ...bodyRecord, model: modelOverride }
      : { ...bodyRecord, model: HAIKU_DEFAULT }
  const outgoing = { ...withModel, model: resolveOutgoingModel(withModel as Record<string, unknown>) }

  const upstream = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(outgoing),
  })

  const text = await upstream.text()
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
    },
  })
}
