import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getReferralSiteUrl, getRemoteJobs } from '@/lib/remote-jobs'
import type { RemoteJob } from '@/lib/types/remote-job'
import { RemoteJobsBrowser } from './RemoteJobsBrowser'
import { InterviewPrepBanner } from '@/components/InterviewPrepBanner'
import { buildRemoteJobsMetadata } from '@/lib/seo'

export const revalidate = 3600

const PAGE_SIZE = 12

export const metadata: Metadata = buildRemoteJobsMetadata()

export default async function RemoteJobsPage() {
  const sourceUrl = getReferralSiteUrl()

  let jobs: RemoteJob[] = []
  try {
    jobs = await getRemoteJobs()
  } catch (e) {
    // Render the shell and let the client retry against /api/remote-jobs.
    console.error('Failed to preload remote jobs', e)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-grow">
        <section className="bg-hero-energy relative overflow-hidden py-14 md:py-20">
          <div
            className="hero-field-lines pointer-events-none absolute inset-0 opacity-100"
            aria-hidden
          />
          <div className="container relative z-[1] mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
              <div className="max-w-xl text-left">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                  Remote jobs
                </p>
                <h1 className="mt-3 text-pretty text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl">
                  Remote technical roles, open right now.
                </h1>
                <p className="mt-4 max-w-lg text-pretty text-lg leading-relaxed text-white/85 md:text-xl">
                  Engineering, AI/ML, data, and security work at micro1—remote
                  worldwide, flexible hours, paid by the hour.
                </p>
                <Button asChild variant="secondary" className="mt-8 w-full gap-1.5 sm:w-auto">
                  <Link
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Browse every micro1 role
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
                  </Link>
                </Button>
              </div>

              <aside className="hidden lg:block">
                <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 shadow-xl backdrop-blur-md">
                  <p className="font-mono text-xs font-medium uppercase tracking-widest text-white/60">
                    Technical openings
                  </p>
                  <p className="mt-4 text-5xl font-bold tabular-nums tracking-tight text-white">
                    {jobs.length || '—'}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    Live roles pulled from micro1, refreshed hourly.
                  </p>
                  <Separator className="my-5 bg-white/15" />
                  <p className="text-sm leading-relaxed text-white/80">
                    Applying through these links uses our micro1 referral—it costs
                    you nothing and supports this site.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <InterviewPrepBanner context="remote" />

        <RemoteJobsBrowser
          initialJobs={jobs.slice(0, PAGE_SIZE)}
          initialTotal={jobs.length}
          indexTotal={jobs.length}
          sourceUrl={sourceUrl}
        />
      </main>

      <Footer />
    </div>
  )
}
