import Link from 'next/link'
import Image from 'next/image'

const REPO_URL = 'https://github.com/tusharv/career-pages-v2'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-card/30">
      <div className="container mx-auto px-4 py-12 md:py-14">
        <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          A fast index of career sites, engineering blogs, and context so you spend
          less time tab-hopping and more time applying.
        </p>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-5 lg:gap-8">
          {/* Open source — balanced column 1 */}
          <div className="flex h-full flex-col rounded-xl border border-border/70 bg-muted/15 p-5 md:p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Open source
            </span>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              This site is an open source project—inspect the code, file issues, or
              contribute improvements on GitHub.
            </p>
            <Link
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              <Image
                width={20}
                height={20}
                src="/logo-cache/github.webp"
                alt=""
                aria-hidden
                priority
              />
              <span className="break-words">tusharv/career-pages-v2</span>
            </Link>
          </div>

          {/* Data attribution — column 2 */}
          <div className="flex h-full flex-col rounded-xl border border-border/70 bg-muted/15 p-5 md:p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Data
            </span>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Company listings come from community-maintained sources and are updated
              over time.
            </p>
            <Link
              href="https://github.com/Kaustubh-Natuskar/moreThanFAANGM/graphs/contributors"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              <Image
                width={20}
                height={20}
                src="/logo-cache/github.webp"
                alt=""
                aria-hidden
                priority
              />
              <span>Thanks to contributors</span>
            </Link>
          </div>

          {/* Stack — column 3 */}
          <div className="flex h-full flex-col rounded-xl border border-border/70 bg-muted/15 p-5 md:p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Built with
            </span>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              shadcn/ui, Vercel, v0, Supabase.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-muted-foreground">
              <Link
                href="https://ui.shadcn.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
              >
                <Image
                  width={16}
                  height={16}
                  src="/logo-cache/ui.shadcn.com.webp"
                  alt=""
                  aria-hidden
                  priority
                />
                shadcn/ui
              </Link>
              <span aria-hidden className="text-border">
                ·
              </span>
              <Link
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
              >
                <Image
                  width={16}
                  height={16}
                  src="/logo-cache/vercel.webp"
                  alt=""
                  aria-hidden
                  priority
                />
                Vercel
              </Link>
              <span aria-hidden className="text-border">
                ·
              </span>
              <Link
                href="https://v0.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
              >
                <Image
                  width={16}
                  height={16}
                  src="/logo-cache/v0.webp"
                  alt=""
                  aria-hidden
                  priority
                />
                v0
              </Link>
              <span aria-hidden className="text-border">
                ·
              </span>
              <Link
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
              >
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 109 113"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                  aria-hidden
                >
                  <path
                    d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
                    fill="url(#cp-footer-supabase-p0)"
                  />
                  <path
                    d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
                    fill="url(#cp-footer-supabase-p1)"
                    fillOpacity={0.2}
                  />
                  <path
                    d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
                    fill="#3ECF8E"
                  />
                  <defs>
                    <linearGradient
                      id="cp-footer-supabase-p0"
                      x1="53.9738"
                      y1="54.974"
                      x2="94.1635"
                      y2="71.8295"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#249361" />
                      <stop offset="1" stopColor="#3ECF8E" />
                    </linearGradient>
                    <linearGradient
                      id="cp-footer-supabase-p1"
                      x1="36.1558"
                      y1="30.578"
                      x2="54.4844"
                      y2="65.0806"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop />
                      <stop offset="1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </svg>
                Supabase
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
