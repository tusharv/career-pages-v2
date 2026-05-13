import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:py-4">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-lg outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Image
            width={36}
            height={36}
            src="/logo.svg"
            alt="Career Pages Logo"
            priority
            className="transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight md:text-xl">Career Pages</span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:block">
              Curated company entry points
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium" aria-label="Main">
          <Link
            href="/report"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Feedback
          </Link>
        </nav>
      </div>
    </header>
  )
}
