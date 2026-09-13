'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { RECENTLY_ADDED_SLUGS } from '@/lib/recently-added'
import { getCompanyLogoSrc } from '@/lib/company-logo'
import type { CompanyListItem, CompaniesPageResponse } from '@/lib/types/company'

export function RecentlyAddedTeaser() {
  const [companies, setCompanies] = useState<CompanyListItem[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const ac = new AbortController()
    const slugs = RECENTLY_ADDED_SLUGS.join(',')
    void fetch(`/api/companies?slugs=${encodeURIComponent(slugs)}`, {
      signal: ac.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return (await response.json()) as CompaniesPageResponse
      })
      .then((body) => {
        setCompanies(body.data)
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setStatus('error')
      })
    return () => ac.abort()
  }, [])

  if (status === 'error' || (status === 'ready' && companies.length === 0)) {
    return null
  }

  return (
    <section className="border-b border-border/60 bg-gradient-to-b from-[hsl(var(--chart-1)/0.08)] to-transparent">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div>
          <p className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--chart-1))]" aria-hidden />
            Recently added
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            Freshly funded Bengaluru startups
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            15 companies that just raised capital — jump straight to their
            career pages.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {status === 'loading'
            ? Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))
            : companies.map((company) => {
                const logoSrc = getCompanyLogoSrc(company.url, company.website)
                return (
                  <Card
                    key={company.slug}
                    className="relative border-border/80 border-l-[3px] border-l-[hsl(var(--chart-1))] shadow-sm motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg motion-safe:hover:border-primary/20"
                  >
                    <Badge
                      variant="secondary"
                      className="absolute right-3 top-3 border-[hsl(var(--chart-1))]/30 bg-[hsl(var(--chart-1)/0.12)] text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--chart-5))]"
                    >
                      New
                    </Badge>
                    <CardHeader className="pb-2 pt-6">
                      <div className="flex items-center gap-3 pr-12">
                        <Avatar className="h-10 w-10 shrink-0 rounded-lg border-0 bg-card">
                          {logoSrc ? (
                            <AvatarImage
                              src={logoSrc}
                              alt=""
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="rounded-lg bg-muted text-xs font-semibold">
                            {company.name
                              .split(' ')
                              .map((word) => word[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 3)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <CardTitle className="text-base leading-snug">
                            <Link
                              href={`/company/${company.slug}`}
                              className="rounded-md text-foreground outline-none ring-offset-background transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              <span className="line-clamp-2">{company.name}</span>
                            </Link>
                          </CardTitle>
                          {(company.meta?.domain || company.meta?.hq) && (
                            <p className="mt-1.5 text-xs leading-snug text-muted-foreground line-clamp-2">
                              {[company.meta.domain, company.meta.hq]
                                .filter(Boolean)
                                .join(' · ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Link
                        href={company.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
                      >
                        <ExternalLink
                          className="h-3.5 w-3.5 shrink-0 opacity-80"
                          aria-hidden
                        />
                        Careers
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
        </div>
      </div>
    </section>
  )
}
