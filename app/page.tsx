import { Closing, Footer } from '@/components/landing/closing'
import { Features } from '@/components/landing/features'
import { Hero } from '@/components/landing/hero'
import { LaunchProvider } from '@/components/landing/launch'
import { Marquee } from '@/components/landing/marquee'
import { Nav } from '@/components/landing/nav'
import { Principle } from '@/components/landing/principle'
import { Steps } from '@/components/landing/steps'
import { MothJourney } from '@/components/landing/sumi/moth-journey'

export default function Home() {
  const apiKeyConfigured = Boolean(process.env.DEEPSEEK_API_KEY?.trim() || process.env.ANTHROPIC_API_KEY?.trim())

  return (
    <LaunchProvider>
      <div className="night">
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Steps />
          <Features />
          <Principle />
          <Closing />
        </main>
        <Footer />
        <MothJourney />
      </div>

      {process.env.NODE_ENV !== 'production' && !apiKeyConfigured && (
        <p className="fixed bottom-4 left-4 z-50 max-w-xs rounded-xl border border-vermilion/40 bg-night-2 p-3 text-xs text-vermilion-2 shadow-lg">
          Dev only: no API key in the environment. Add DEEPSEEK_API_KEY to .env.local, then restart npm run dev.
        </p>
      )}
    </LaunchProvider>
  )
}
