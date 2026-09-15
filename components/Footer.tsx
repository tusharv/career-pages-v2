import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'

const REPO_URL = 'https://github.com/tusharv/career-pages-v2'
const PEERLIST_URL = 'https://peerlist.io/tusharv/project/career-pages'
const PRODUCT_HUNT_URL =
  'https://www.producthunt.com/products/career-pages?launch=career-pages'
const CONTRIBUTORS_URL =
  'https://github.com/Kaustubh-Natuskar/moreThanFAANGM/graphs/contributors'

const NAV = [
  { href: '/', label: 'Companies' },
  { href: '/remote-jobs', label: 'Remote jobs' },
  { href: '/interview-prep', label: 'Interview prep' },
] as const

function TextLink({
  href,
  children,
  external = false,
  muted = false,
}: {
  href: string
  children: ReactNode
  external?: boolean
  muted?: boolean
}) {
  return (
    <Link
      href={href}
      {...(external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
        muted ? 'text-muted-foreground' : 'text-foreground'
      }`}
    >
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-card/30">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div className="max-w-md">
            <p className="text-sm leading-relaxed text-muted-foreground">
              A fast index of career sites, engineering blogs, and context so you
              spend less time tab-hopping and more time applying. Listings come
              from community-maintained sources.
            </p>
            <nav
              aria-label="Footer"
              className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              {NAV.map((item) => (
                <TextLink key={item.href} href={item.href}>
                  {item.label}
                </TextLink>
              ))}
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-sm text-muted-foreground">Like us on</span>
            <TextLink href={PEERLIST_URL} external>
              <Image
                width={16}
                height={16}
                src="/logo-cache/peerlist.webp"
                alt=""
                aria-hidden
                className="rounded-full"
              />
              Peerlist
            </TextLink>
            <TextLink href={PRODUCT_HUNT_URL} external>
              <Image
                width={16}
                height={16}
                src="/logo-cache/producthunt.webp"
                alt=""
                aria-hidden
                className="rounded-full"
              />
              Product Hunt
            </TextLink>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <TextLink href={REPO_URL} external>
              <Image
                width={16}
                height={16}
                src="/logo-cache/github.webp"
                alt=""
                aria-hidden
              />
              tusharv/career-pages-v2
            </TextLink>
            <TextLink href={CONTRIBUTORS_URL} external>
              <Image
                width={16}
                height={16}
                src="/logo-cache/github.webp"
                alt=""
                aria-hidden
              />
              Contributors
            </TextLink>
          </div>

          <nav
            aria-label="Built with"
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
          >
            <TextLink href="https://ui.shadcn.com/" external muted>
              <Image
                width={16}
                height={16}
                src="/logo-cache/ui.shadcn.com.webp"
                alt=""
                aria-hidden
              />
              shadcn/ui
            </TextLink>
            <TextLink href="https://vercel.com" external muted>
              <Image
                width={16}
                height={16}
                src="/logo-cache/vercel.webp"
                alt=""
                aria-hidden
              />
              Vercel
            </TextLink>
            <TextLink href="https://v0.dev/" external muted>
              <Image
                width={16}
                height={16}
                src="/logo-cache/v0.webp"
                alt=""
                aria-hidden
              />
              v0
            </TextLink>
            <TextLink href="https://supabase.com" external muted>
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
            </TextLink>
            <TextLink href="https://cursor.com" external muted>
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
                aria-hidden
              >
                <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
              </svg>
              Cursor
            </TextLink>
          </nav>
        </div>
      </div>
    </footer>
  )
}
