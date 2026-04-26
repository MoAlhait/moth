import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Home() {
  const apiKeyConfigured = Boolean(process.env.ANTHROPIC_API_KEY?.trim())

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
          color: '#38bdf8',
          opacity: 0.95,
        }}
      >
        moth/
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', textAlign: 'center' }}>
        Next.js shell for <span style={{ color: '#38bdf8' }}>moth</span>
      </h1>
      <p style={{ color: '#8b949e', textAlign: 'center', maxWidth: 420 }}>
        Homework helper runs at <code style={{ color: '#e6edf3' }}>/moth</code>. API calls go through{' '}
        <code style={{ color: '#e6edf3' }}>/api/claude</code> using{' '}
        <code style={{ color: '#e6edf3' }}>ANTHROPIC_API_KEY</code> on the server.
      </p>
      <p
        style={{
          fontSize: 13,
          textAlign: 'center',
          maxWidth: 480,
          padding: '10px 14px',
          borderRadius: 8,
          border: apiKeyConfigured ? '1px solid rgba(52,211,153,0.35)' : '1px solid rgba(248,113,113,0.45)',
          background: apiKeyConfigured ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.1)',
          color: apiKeyConfigured ? '#34d399' : '#f87171',
        }}
      >
        {apiKeyConfigured
          ? 'Anthropic API key is loaded (server). Open /moth to use Claude.'
          : 'No ANTHROPIC_API_KEY in the environment. Copy .env.example to .env.local, add your key from console.anthropic.com, then restart npm run dev.'}
      </p>
      <nav style={{ marginTop: 8 }}>
        <Link
          href="/moth"
          style={{
            display: 'inline-block',
            padding: '10px 22px',
            borderRadius: 8,
            background: '#38bdf8',
            color: '#0d1117',
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
