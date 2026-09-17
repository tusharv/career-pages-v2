'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { RemoteJobCard } from '@/components/RemoteJobCard'
import type {
  RemoteJob,
  RemoteJobsPageResponse,
} from '@/lib/types/remote-job'

const TEASER_COUNT = 3

export function RemoteJobsTeaser() {
  const [jobs, setJobs] = useState<RemoteJob[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const ac = new AbortController()
    void fetch(`/api/remote-jobs?page=1&limit=${TEASER_COUNT}`, {
      signal: ac.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return (await response.json()) as RemoteJobsPageResponse
      })
      .then((body) => {
        setJobs(body.data)
        setTotal(body.indexTotal)
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setStatus('error')
      })
    return () => ac.abort()
  }, [])

  // Nothing useful to show — keep the home page clean rather than render an error.
  if (status === 'error' || (status === 'ready' && jobs.length === 0)) {
    return null
  }

  return (
    <section className="border-b border-border/60 bg-card/40">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <Globe2 className="h-3.5 w-3.5" aria-hidden />
              Remote jobs
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Remote technical roles at micro1
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Engineering, AI/ML, data, and security work you can do from
              anywhere—flexible hours, paid hourly.
            </p>
          </div>

          <Button asChild variant="outline" className="w-full shrink-0 gap-1.5 sm:w-auto">
            <Link href="/remote-jobs">
              {status === 'ready' && total > 0
                ? `View all ${total} roles`
                : 'View all roles'}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {status === 'loading'
            ? Array.from({ length: TEASER_COUNT }, (_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))
            : jobs.map((job) => <RemoteJobCard key={job.id} job={job} />)}
        </div>
      </div>
    </section>
  )
}
