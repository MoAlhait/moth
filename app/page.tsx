import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Home() {
  const apiKeyConfigured = Boolean(process.env.DEEPSEEK_API_KEY?.trim() || process.env.ANTHROPIC_API_KEY?.trim())

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: 20,
      }}
    >
      <p
        style={{
          fontFamily: 'ui-monospace, monospace',
          fontSize: 12,
          letterSpacing: '0.06em',
          color: '#c8d66d',
          opacity: 0.95,
        }}
      >
        moth/
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', textAlign: 'center' }}>
        Next.js shell for <span style={{ color: '#c8d66d' }}>moth</span>
      </h1>
      <p style={{ color: '#c4c6bc', textAlign: 'center', maxWidth: 420 }}>
        Homework helper runs at <code style={{ color: '#efeee8' }}>/moth</code>. API calls go through{' '}
        <code style={{ color: '#efeee8' }}>/api/claude</code> using{' '}
        <code style={{ color: '#efeee8' }}>DEEPSEEK_API_KEY</code> (or <code style={{ color: '#efeee8' }}>ANTHROPIC_API_KEY</code> as a backup) on the server.
      </p>
      <p
        style={{
          fontSize: 13,
          textAlign: 'center',
          maxWidth: 480,
          padding: '10px 14px',
          borderRadius: 8,
          border: apiKeyConfigured ? '1px solid rgba(200,214,109,0.35)' : '1px solid rgba(200,134,120,0.45)',
          background: apiKeyConfigured ? 'rgba(200,214,109,0.08)' : 'rgba(200,134,120,0.1)',
          color: apiKeyConfigured ? '#c8d66d' : '#c88678',
        }}
      >
        {apiKeyConfigured
          ? 'API key is loaded (server). Open /moth to start.'
          : 'No API key in the environment. Add DEEPSEEK_API_KEY to .env.local (key from platform.deepseek.com), then restart npm run dev.'}
      </p>
      <nav style={{ marginTop: 8 }}>
        <Link
          href="/moth"
          style={{
            display: 'inline-block',
            padding: '10px 22px',
            borderRadius: 8,
            background: '#c8d66d',
            color: '#111411',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          open moth →
        </Link>
      </nav>
    </main>
  )
}
