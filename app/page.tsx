'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import _ from 'lodash'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CompaniesSectionSkeleton } from '@/components/CompaniesSectionSkeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  BookOpen,
  Search,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  CircleX,
  BookmarkPlus,
  BookmarkCheck,
  ExternalLink,
} from 'lucide-react'
import AutoSuggest from '@/components/AutoSuggest'
import { CompanyCardMoreMenu } from '@/components/CompanyCardMoreMenu'
import { useEasterEgg } from '@/hooks/useEasterEgg'
import { useCompanies } from './CompaniesContext'
import type { Company } from './CompaniesContext'
import type { CompaniesPageResponse } from '@/lib/types/company'
import { getCompanyLogoSrc } from '@/lib/company-logo'
import { cn } from '@/lib/utils'

import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

const SAVED_JOBS_KEY = 'careerPages.savedJobs'

function getSavedKeys(): string[] {
  const savedJSON = localStorage.getItem(SAVED_JOBS_KEY)
  return savedJSON ? JSON.parse(savedJSON) : []
}

function setSavedKeys(keys: string[]): void {
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(keys))
}

function addSavedKey(key: string): void {
  const keys = getSavedKeys()
  if (!keys.includes(key)) {
    keys.push(key)
    setSavedKeys(keys)
  }
}

function removeSavedKey(key: string): void {
  const keys = getSavedKeys().filter((k) => k !== key)
  setSavedKeys(keys)
}

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    state: { companies, total, indexTotal, loading, error },
    dispatch,
  } = useCompanies()
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get('search') || ''
  )
  const [debouncedSearch, setDebouncedSearch] = useState(
    () => searchParams.get('search') || ''
  )
  const [currentPage, setCurrentPage] = useState(1)
  const companiesPerPage = 12
  const { toast } = useToast()

  const skipNextUrlSync = useRef(false)
  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams

  const EASTER_EGG_COMPANIES = useMemo(
    () => process.env.NEXT_PUBLIC_EASTER_EGG_COMPANIES?.split(',') ?? [],
    []
  )

  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { triggerEasterEgg, EasterEggComponent } = useEasterEgg()
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  /** While “More” is open, lift this card above siblings so the menu is not covered. */
  const [elevatedCardUrl, setElevatedCardUrl] = useState<string | null>(null)
  const [suggestionNames, setSuggestionNames] = useState<string[]>([])

  const viewMode = searchParams.get('view') === 'saved' ? 'saved' : 'all'

  const replaceHomeUrl = useCallback(
    (opts: { search?: string; view?: 'all' | 'saved' }) => {
      skipNextUrlSync.current = true
      const p = new URLSearchParams()
      const s =
        opts.search !== undefined ? opts.search : searchParams.get('search') || ''
      const v =
        opts.view !== undefined
          ? opts.view
          : searchParams.get('view') === 'saved'
            ? 'saved'
            : 'all'
      if (s) p.set('search', s)
      if (v === 'saved') p.set('view', 'saved')
      const qs = p.toString()
      router.replace(qs ? `/?${qs}` : '/', { scroll: false })
    },
    [router, searchParams]
  )

  const throttledReplaceSearch = useMemo(
    () =>
      _.throttle((value: string) => {
        const p = new URLSearchParams()
        if (value) p.set('search', value)
        if (searchParamsRef.current.get('view') === 'saved') {
          p.set('view', 'saved')
        }
        skipNextUrlSync.current = true
        router.replace(p.toString() ? `/?${p}` : '/', { scroll: false })
      }, 280),
    [router]
  )

  useEffect(() => {
    return () => throttledReplaceSearch.cancel()
  }, [throttledReplaceSearch])

  const queryKey = searchParams.toString()

  useEffect(() => {
    if (skipNextUrlSync.current) {
      skipNextUrlSync.current = false
      return
    }
    const s = new URLSearchParams(queryKey).get('search') || ''
    setSearchTerm(s)
    setDebouncedSearch(s)
  }, [queryKey])

  useEffect(() => {
    setCurrentPage(1)
  }, [queryKey])

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => window.clearTimeout(id)
  }, [searchTerm])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    setSavedJobs(getSavedKeys())
  }, [])

  useEffect(() => {
    const stored = getSavedKeys()
    if (
      !stored.some(
        (v) => typeof v === 'string' && v.length > 0 && !v.startsWith('http')
      )
    ) {
      return
    }
    let cancelled = false
    void fetch('/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'migrate', keys: stored }),
    })
      .then(async (response) => {
        const body = (await response.json()) as { keys?: string[]; error?: string }
        if (!response.ok) {
          throw new Error(body.error || `HTTP ${response.status}`)
        }
        if (!body.keys) throw new Error('Invalid migrate response')
        return body.keys
      })
      .then((keys) => {
        if (cancelled) return
        setSavedKeys(keys)
        setSavedJobs(keys)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const ac = new AbortController()
    dispatch({ type: 'FETCH_START' })

    const run = async () => {
      try {
        if (viewMode === 'saved') {
          const response = await fetch('/api/companies', {
            method: 'POST',
            signal: ac.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              kind: 'saved',
              page: currentPage,
              pageSize: companiesPerPage,
              keys: savedJobs,
            }),
          })
          const body = (await response.json()) as CompaniesPageResponse & {
            error?: string
          }
          if (!response.ok) {
            throw new Error(body.error || `HTTP ${response.status}`)
          }
          dispatch({
            type: 'FETCH_SUCCESS',
            payload: {
              companies: body.data,
              total: body.total,
              indexTotal: body.indexTotal,
            },
          })
          return
        }

        const qs = new URLSearchParams({
          page: String(currentPage),
          limit: String(companiesPerPage),
        })
        const q = debouncedSearch.trim()
        if (q) qs.set('q', q)
        const response = await fetch(`/api/companies?${qs}`, {
          signal: ac.signal,
        })
        const body = (await response.json()) as CompaniesPageResponse & {
          error?: string
        }
        if (!response.ok) {
          throw new Error(body.error || `HTTP ${response.status}`)
        }
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            companies: body.data,
            total: body.total,
            indexTotal: body.indexTotal,
          },
        })
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        dispatch({
          type: 'FETCH_ERROR',
          payload: err instanceof Error ? err.message : 'Request failed',
        })
        console.error('Error loading companies:', err)
      }
    }

    void run()
    return () => ac.abort()
  }, [
    dispatch,
    viewMode,
    currentPage,
    companiesPerPage,
    debouncedSearch,
    savedJobs,
  ])

  useEffect(() => {
    const t = searchTerm.trim()
    if (t.length === 0) {
      setSuggestionNames([])
      return
    }
    const ac = new AbortController()
    const timeout = window.setTimeout(() => {
      const qs = new URLSearchParams({ page: '1', limit: '10', q: t })
      void fetch(`/api/companies?${qs}`, { signal: ac.signal })
        .then(async (r) => {
          const body = (await r.json()) as CompaniesPageResponse
          if (!r.ok || !Array.isArray(body.data)) return
          if (!ac.signal.aborted) {
            setSuggestionNames(body.data.map((c) => c.name))
          }
        })
        .catch(() => {
          if (!ac.signal.aborted) setSuggestionNames([])
        })
    }, 200)
    return () => {
      ac.abort()
      window.clearTimeout(timeout)
    }
  }, [searchTerm])

  const handleClearSearch = useCallback(() => {
    throttledReplaceSearch.cancel()
    setSearchTerm('')
    setDebouncedSearch('')
    replaceHomeUrl({ search: '' })
    inputRef.current?.focus()
  }, [replaceHomeUrl, throttledReplaceSearch])

  const handleInputChange = useCallback(
    (value: string) => {
      setSearchTerm(value)
      setShowSuggestions(true)
      throttledReplaceSearch(value)
    },
    [throttledReplaceSearch]
  )

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      throttledReplaceSearch.cancel()
      setSearchTerm(suggestion)
      setDebouncedSearch(suggestion)
      setShowSuggestions(false)
      replaceHomeUrl({ search: suggestion })
      inputRef.current?.focus()
    },
    [replaceHomeUrl, throttledReplaceSearch]
  )

  const handleViewChange = useCallback(
    (next: 'all' | 'saved') => {
      replaceHomeUrl({ view: next })
    },
    [replaceHomeUrl]
  )

  const totalPages = useMemo(
    () => (total > 0 ? Math.ceil(total / companiesPerPage) : 0),
    [total, companiesPerPage]
  )

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])

  const isEasterEggCompany = useMemo(() => {
    return (company: Company) =>
      EASTER_EGG_COMPANIES.some((name) =>
        company.name.toLowerCase().includes(name.toLowerCase())
      )
  }, [EASTER_EGG_COMPANIES])

  const handleSaveToggle = (company: Company) => {
    const keyUrl = company.url
    const legacyId = company.id != null ? String(company.id) : null
    const current = getSavedKeys()
    const hasNew = current.includes(keyUrl)
    const hasLegacy = legacyId ? current.includes(legacyId) : false

    if (hasNew) {
      removeSavedKey(keyUrl)
    } else {
      addSavedKey(keyUrl)
      if (hasLegacy && legacyId) removeSavedKey(legacyId)
    }
    setSavedJobs(getSavedKeys())
  }

  const shareCompany = useCallback(
    (company: Company) => {
      const origin =
        typeof window !== 'undefined' ? window.location.origin : ''
      const shareUrl = `${origin}/?search=${encodeURIComponent(company.name)}`
      void navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: 'Link copied',
          description: `Share URL for ${company.name} is on your clipboard.`,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
          },
        })
      })
    },
    [toast]
  )

  const listCount = total

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-grow">
        <section className="bg-hero-energy relative overflow-hidden py-14 md:py-20">
          <div
            className="hero-field-lines pointer-events-none absolute inset-0 opacity-100"
            aria-hidden
          />
          <div className="pointer-events-none absolute -right-24 top-1/2 h-[min(520px,70vw)] w-[min(520px,70vw)] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(0_0%_100%/0.14),transparent_65%)] motion-reduce:hidden"
            aria-hidden
          />

          <div className="container relative z-[1] mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
              <div className="max-w-xl text-left">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                  Index
                </p>
                <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl">
                  Your shortcut to real career pages.
                </h1>
                <p className="mt-4 max-w-lg text-pretty text-lg leading-relaxed text-white/85 md:text-xl">
                  Jump straight to hiring sites, engineering blogs, and context—without
                  opening a dozen tabs.
                </p>

                <div className="relative mt-8 max-w-md">
                  <label htmlFor="company-search" className="sr-only">
                    Search companies by name
                  </label>
                  <Input
                    id="company-search"
                    type="text"
                    placeholder="Search by company name"
                    className="h-12 w-full border-white/20 bg-white/95 pr-28 text-foreground shadow-sm placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                    value={searchTerm}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                    ref={inputRef}
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-1 top-1/2 h-10 -translate-y-1/2 px-3 text-white hover:bg-white/10 hover:text-white"
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
                  {showSuggestions && suggestionNames.length > 0 && (
                    <AutoSuggest
                      suggestions={suggestionNames}
                      onSuggestionClick={handleSuggestionClick}
                      onClose={() => setShowSuggestions(false)}
                    />
                  )}
                </div>
              </div>

              <aside className="hidden lg:block">
                <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 shadow-xl backdrop-blur-md">
                  <p className="font-mono text-xs font-medium uppercase tracking-widest text-white/60">
                    Live directory
                  </p>
                  {loading ? (
                    <p className="mt-4 text-5xl font-bold tabular-nums text-white">
                      ∞
                    </p>
                  ) : (
                    <p className="mt-4 text-5xl font-bold tabular-nums tracking-tight text-white">
                      {indexTotal}
                    </p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    Companies with public career entry points in this index.
                  </p>
                  <Separator className="my-5 bg-white/15" />
                  <p className="text-sm leading-relaxed text-white/80">
                    Save bookmarks to build a shortlist—stored locally in your
                    browser.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {loading && !error && (
          <CompaniesSectionSkeleton cardCount={companiesPerPage} />
        )}

        {error && (
          <div className="container mx-auto max-w-lg px-4 py-16 text-center">
            <h2 className="text-2xl font-bold text-destructive">
              Something went wrong
            </h2>
            <p className="mt-3 text-muted-foreground">{error}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try refreshing the page or check back shortly.
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Companies
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {viewMode === 'saved'
                    ? 'Your bookmarked companies—pick up where you left off.'
                    : 'Open careers sites, skim engineering blogs, and dig into context in one place.'}
                </p>
              </div>

              <Tabs
                value={viewMode}
                onValueChange={(v) => handleViewChange(v as 'all' | 'saved')}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid h-11 w-full grid-cols-2 gap-1 rounded-xl bg-muted/80 p-1 sm:inline-flex sm:w-auto">
                  <TabsTrigger value="all" className="rounded-lg px-4">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="rounded-lg px-4 gap-2">
                    Saved
                    {savedJobs.length > 0 ? (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary tabular-nums">
                        {savedJobs.length}
                      </span>
                    ) : null}
                  </TabsTrigger>
                </TabsList>
                {/* Radix sets aria-controls on triggers; panels must exist for valid IDs */}
                <TabsContent value="all" className="mt-0 hidden p-0" aria-hidden />
                <TabsContent value="saved" className="mt-0 hidden p-0" aria-hidden />
              </Tabs>
            </div>

            <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Showing{' '}
              <span className="font-semibold text-foreground">
                {listCount}
              </span>{' '}
              {viewMode === 'saved' ? 'saved' : 'matching'} —{' '}
              <span className="tabular-nums">{indexTotal}</span> in index
            </p>

            {viewMode === 'saved' && total === 0 ? (
              <div className="mt-12 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
                <h3 className="text-xl font-semibold">No saved companies yet</h3>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                  Bookmark a company from the list—your shortlist stays on this
                  device.
                </p>
                <Button
                  type="button"
                  className="mt-6"
                  variant="secondary"
                  onClick={() => handleViewChange('all')}
                >
                  Browse all companies
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
                {companies.map((company: Company) => {
                  const logoSrc = getCompanyLogoSrc(company.url)
                  const isSaved =
                    savedJobs.includes(company.url) ||
                    savedJobs.includes(String(company.id))
                  return (
                    <Card
                      key={company.url}
                      className={cn(
                        'relative border-border/80 shadow-sm motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg motion-safe:hover:border-primary/20',
                        isSaved &&
                          'border-l-[3px] border-l-[hsl(var(--chart-1))] shadow-md',
                        elevatedCardUrl === company.url && 'z-50'
                      )}
                      onClick={() => {
                        if (isEasterEggCompany(company)) {
                          triggerEasterEgg()
                        }
                      }}
                    >
                      <CardHeader className="pb-2 pt-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 shrink-0 rounded-lg border-0 bg-card">
                            {logoSrc ? (
                              <AvatarImage
                                src={logoSrc}
                                alt=""
                                className="object-cover"
                              />
                            ) : null}
                            <AvatarFallback className="rounded-lg bg-muted text-xs font-semibold">
                              {company?.name
                                ?.split(' ')
                                .map((word) => word[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 3)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-1 items-center">
                            <CardTitle className="text-base leading-snug">
                              <Link
                                href={`/company/${company.slug}`}
                                className="rounded-md text-foreground outline-none ring-offset-background transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="line-clamp-2">
                                  {company?.name}
                                </span>
                              </Link>
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-2.5 pt-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <Link
                            href={`${company.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink
                              className="h-3.5 w-3.5 shrink-0 opacity-80"
                              aria-hidden
                            />
                            Careers
                          </Link>
                          {company.blog ? (
                            <Link
                              href={`${company.blog}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex max-w-full items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <BookOpen
                                className="h-3.5 w-3.5 shrink-0 opacity-80"
                                aria-hidden
                              />
                              Blog
                            </Link>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-2.5">
                          <Button
                            type="button"
                            variant={isSaved ? 'secondary' : 'outline'}
                            size="sm"
                            className="h-8 gap-1.5"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSaveToggle(company)
                            }}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="h-4 w-4" aria-hidden />
                            ) : (
                              <BookmarkPlus className="h-4 w-4" aria-hidden />
                            )}
                            {isSaved ? 'Saved' : 'Save'}
                          </Button>
                          <CompanyCardMoreMenu
                            company={company}
                            onShare={() => shareCompany(company)}
                            onOpenChange={(open) =>
                              setElevatedCardUrl((prev) =>
                                open
                                  ? company.url
                                  : prev === company.url
                                    ? null
                                    : prev
                              )
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {totalPages > 1 ? (
              <nav
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
                aria-label="Pagination"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  aria-label="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="inline-flex min-w-[8.5rem] items-center justify-center rounded-full border border-border bg-muted/60 px-4 py-2 text-sm font-medium tabular-nums text-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  aria-label="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </nav>
            ) : null}
          </div>
        )}
      </main>

      <Footer />
      <EasterEggComponent />
    </div>
  )
}
