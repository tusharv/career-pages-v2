import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 md:py-4">
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

        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground outline-none ring-offset-background transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-3"
          >
            Companies
          </Link>
          <Link
            href="/remote-jobs"
            className="rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground outline-none ring-offset-background transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-3"
          >
            Remote jobs
          </Link>
        </nav>
      </div>
    </header>
  )
}
