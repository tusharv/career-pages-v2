'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleX,
  ExternalLink,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { RemoteJobCard } from '@/components/RemoteJobCard'
import { cn } from '@/lib/utils'
import {
  REMOTE_JOB_CATEGORIES,
  type RemoteJob,
  type RemoteJobCategory,
  type RemoteJobsPageResponse,
} from '@/lib/types/remote-job'

const PAGE_SIZE = 12

type Props = {
  initialJobs: RemoteJob[]
  initialTotal: number
  indexTotal: number
  sourceUrl: string
}

export function RemoteJobsBrowser({
  initialJobs,
  initialTotal,
  indexTotal,
  sourceUrl,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory] = useState<RemoteJobCategory | null>(null)
  const [page, setPage] = useState(1)

  const [jobs, setJobs] = useState<RemoteJob[]>(initialJobs)
  const [total, setTotal] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  /** The server already rendered page 1 of the unfiltered list. */
  const isInitialQuery = page === 1 && !debouncedSearch && !category
  const skipFirstFetch = useRef(true)

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => window.clearTimeout(id)
  }, [searchTerm])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category])

  useEffect(() => {
    if (skipFirstFetch.current && isInitialQuery) {
      skipFirstFetch.current = false
      return
    }
    skipFirstFetch.current = false

    const ac = new AbortController()
    setLoading(true)

    const qs = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
    })
    if (debouncedSearch.trim()) qs.set('q', debouncedSearch.trim())
    if (category) qs.set('category', category)

    void fetch(`/api/remote-jobs?${qs}`, { signal: ac.signal })
      .then(async (response) => {
        const body = (await response.json()) as RemoteJobsPageResponse & {
          error?: string
        }
        if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`)
        setJobs(body.data)
        setTotal(body.total)
        setError(null)
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Request failed')
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false)
      })

    return () => ac.abort()
  }, [page, debouncedSearch, category, isInitialQuery])

  const totalPages = useMemo(
    () => (total > 0 ? Math.ceil(total / PAGE_SIZE) : 0),
    [total]
  )

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    setDebouncedSearch('')
    inputRef.current?.focus()
  }, [])

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Open technical roles
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Contract and full-time remote work training and evaluating frontier AI
            models. Apply directly on micro1—no account needed here.
          </p>
        </div>

        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="remote-job-search" className="sr-only">
            Search remote roles by title or skill
          </label>
          <Input
            id="remote-job-search"
            type="text"
            placeholder="Search by role or skill"
            className="h-11 w-full pr-24"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={inputRef}
            autoComplete="off"
          />
          <Button
            type="button"
            variant="ghost"
            className="absolute right-1 top-1/2 h-9 -translate-y-1/2 px-3"
            onClick={() => {
              if (searchTerm) handleClearSearch()
              else inputRef.current?.focus()
            }}
          >
            {searchTerm ? (
              <>
                <CircleX className="mr-2 h-4 w-4" aria-hidden />
                Clear
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" aria-hidden />
                Search
              </>
            )}
          </Button>
        </div>
      </div>

      <div
        className="mt-6 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter roles by category"
      >
        <Button
          type="button"
          size="sm"
          variant={category === null ? 'default' : 'outline'}
          aria-pressed={category === null}
          onClick={() => setCategory(null)}
          className="rounded-full"
        >
          All
        </Button>
        {REMOTE_JOB_CATEGORIES.map((c) => (
          <Button
            key={c.id}
            type="button"
            size="sm"
            variant={category === c.id ? 'default' : 'outline'}
            aria-pressed={category === c.id}
            onClick={() => setCategory(c.id)}
            className="rounded-full"
          >
            {c.label}
          </Button>
        ))}
      </div>

      <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{total}</span>{' '}
        matching — <span className="tabular-nums">{indexTotal}</span> technical
        roles open
      </p>

      {error ? (
        <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
          <h3 className="text-lg font-semibold text-destructive">
            Could not load roles
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button asChild variant="secondary" className="mt-6 gap-1.5">
            <Link href={sourceUrl} target="_blank" rel="noopener noreferrer">
              Browse on micro1
              <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
            </Link>
          </Button>
        </div>
      ) : loading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }, (_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
          <h3 className="text-xl font-semibold">No roles match that search</h3>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Try a broader keyword, or clear the category filter.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-6"
            onClick={() => {
              handleClearSearch()
              setCategory(null)
            }}
          >
            Reset filters
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3'
          )}
        >
          {jobs.map((job) => (
            <RemoteJobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 1 ? (
        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          aria-label="Pagination"
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setPage(1)}
            disabled={page === 1}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="inline-flex min-w-[8.5rem] items-center justify-center rounded-full border border-border bg-muted/60 px-4 py-2 text-sm font-medium tabular-nums text-foreground">
            Page {page} of {totalPages}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </nav>
      ) : null}
    </div>
  )
}
