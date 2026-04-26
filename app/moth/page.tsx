export default function MothPage() {
  return (
    <iframe
      src="/moth.html"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        display: 'block',
        zIndex: 9999,
      }}
      title="moth — ai homework helper"
    />
  )
}

export const metadata = {
  title: 'moth — ai homework helper',
  description: 'paste your homework. get guided through it line by line.',
}
