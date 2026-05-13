'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  MoreHorizontal,
  Search,
  Newspaper,
  Handshake,
  Share2,
  Bug,
} from 'lucide-react'
import type { Company } from '@/app/CompaniesContext'

type CompanyCardMoreMenuProps = {
  company: Company
  onShare: () => void
  /** Lets the parent raise this card’s stacking order so the menu paints over the grid below. */
  onOpenChange?: (open: boolean) => void
}

export function CompanyCardMoreMenu({
  company,
  onShare,
  onOpenChange,
}: CompanyCardMoreMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    onOpenChange?.(false)
  }, [onOpenChange])

  const toggle = () => {
    setOpen((v) => {
      const next = !v
      onOpenChange?.(next)
      return next
    })
  }

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return
      close()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, close])

  const reportHref = `https://github.com/tusharv/career-pages-v2/issues/new?template=bug_report.yml&title=${encodeURIComponent(`bug: ${company.name}`)}`

  return (
    <div className="relative" ref={rootRef}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 border-border/80 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => {
          e.stopPropagation()
          toggle()
        }}
      >
        <MoreHorizontal className="h-4 w-4 shrink-0" aria-hidden />
        More
      </Button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-[80] mt-1.5 min-w-[11.5rem] overflow-hidden rounded-lg border border-border bg-popover py-1 text-popover-foreground shadow-lg animate-suggest-in"
        >
          <Link
            role="menuitem"
            href={`https://www.google.com/search?q=${encodeURIComponent(company.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() => close()}
          >
            <Search className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
            Web search
          </Link>
          <Link
            role="menuitem"
            href={`https://news.google.com/search?q=${encodeURIComponent(company.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() => close()}
          >
            <Newspaper className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
            News
          </Link>
          <Link
            role="menuitem"
            href={`https://google.com/search?q=${encodeURIComponent(`site:theorg.com ${company.name}`)}&btnI=I`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() => close()}
          >
            <Handshake className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
            People
            <span className="ml-auto rounded bg-muted px-1 py-px text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              beta
            </span>
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={(e) => {
              e.stopPropagation()
              onShare()
              close()
            }}
          >
            <Share2 className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
            Copy share link
          </button>
          <Link
            role="menuitem"
            href={reportHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() => close()}
          >
            <Bug className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
            Report data issue
          </Link>
        </div>
      ) : null}
    </div>
  )
}
