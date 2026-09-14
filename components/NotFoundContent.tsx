'use client'

import Link from 'next/link'
import { ArrowLeft, Briefcase, Home, MapPinOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function NotFoundContent() {
  return (
    <main className="flex flex-grow flex-col">
      <section className="bg-hero-energy relative flex flex-grow items-center overflow-hidden py-16 md:py-24">
        <div
          className="hero-field-lines pointer-events-none absolute inset-0 opacity-100"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,hsl(48_100%_50%/0.12),transparent_65%)] motion-reduce:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-[min(480px,60vw)] w-[min(480px,60vw)] rounded-full bg-[radial-gradient(circle_at_center,hsl(0_0%_100%/0.1),transparent_65%)] motion-reduce:hidden"
          aria-hidden
        />

        <div className="container relative z-[1] mx-auto px-4">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="relative mb-8 h-28 w-full max-w-xs motion-reduce:mb-6 md:h-32 md:max-w-sm">
              <svg
                viewBox="0 0 320 80"
                className="h-full w-full text-white/25"
                aria-hidden
              >
                <path
                  d="M 8 56 Q 80 12 160 40 T 312 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="360"
                  className="animate-not-found-path"
                />
              </svg>

              <div className="absolute left-[72%] top-[8%] motion-reduce:static motion-reduce:mx-auto motion-reduce:mt-4">
                <span className="relative flex h-14 w-14 items-center justify-center md:h-16 md:w-16">
                  <span className="absolute inline-flex h-full w-full animate-not-found-ping rounded-full bg-[hsl(var(--ring)/0.35)] motion-reduce:hidden" />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm md:h-16 md:w-16">
                    <MapPinOff
                      className="h-7 w-7 text-[hsl(var(--ring))] motion-safe:animate-not-found-wobble md:h-8 md:w-8"
                      aria-hidden
                    />
                  </span>
                </span>
              </div>
            </div>

            <p
              className="animate-not-found-fade-up font-mono text-xs font-medium uppercase tracking-[0.25em] text-white/70"
              style={{ animationDelay: '0.1s' }}
            >
              Off the map
            </p>

            <div
              className="mt-4 flex items-end justify-center gap-1 sm:gap-2"
              aria-hidden
            >
              {['4', '0', '4'].map((digit, index) => (
                <span
                  key={digit + index}
                  className={cn(
                    'text-[clamp(4.5rem,18vw,7.5rem)] font-bold leading-none tracking-tighter text-white',
                    'motion-safe:animate-not-found-digit-float'
                  )}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {digit}
                </span>
              ))}
            </div>

            <h1
              className="animate-not-found-fade-up mt-6 text-balance text-2xl font-bold tracking-tight text-white md:text-3xl"
              style={{ animationDelay: '0.25s' }}
            >
              This page isn&apos;t on the roster
            </h1>

            <p
              className="animate-not-found-fade-up mt-4 max-w-md text-pretty text-base leading-relaxed text-white/80 md:text-lg"
              style={{ animationDelay: '0.35s' }}
            >
              The career path you followed doesn&apos;t exist here. It may have moved,
              been removed, or never made the index.
            </p>

            <div
              className="animate-not-found-fade-up mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center"
              style={{ animationDelay: '0.45s' }}
            >
              <Button
                asChild
                size="lg"
                className="h-11 bg-[hsl(var(--ring))] px-6 text-[hsl(222_58%_10%)] shadow-lg hover:bg-[hsl(var(--ring)/0.9)] focus-visible:ring-white/40"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" aria-hidden />
                  Back to home
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 border-white/25 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white focus-visible:ring-white/40"
              >
                <Link href="/remote-jobs">
                  <Briefcase className="mr-2 h-4 w-4" aria-hidden />
                  Remote jobs
                </Link>
              </Button>
            </div>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="animate-not-found-fade-up mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:transition-none"
              style={{ animationDelay: '0.55s' }}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Go back
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
