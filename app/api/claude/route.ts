import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

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

  const modelOverride = process.env.ANTHROPIC_MODEL?.trim()
  const outgoing = modelOverride ? { ...bodyRecord, model: modelOverride } : bodyRecord

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
