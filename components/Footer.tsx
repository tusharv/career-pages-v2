import Link from 'next/link'
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col justify-center items-center sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span>Built using</span>
            <Link href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline flex items-center">
              <Image
                width={16}
                height={16}
                src='/logo-cache/ui.shadcn.com.webp'
                alt='shadcn Logo'
                className='mx-1'
                priority
              />
              shadcn/ui
            </Link>
            <span>&nbsp;</span>
            <Link href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline flex items-center">
              <Image
                width={16}
                height={16}
                src='/logo-cache/vercel.webp'
                alt='Vercel Logo'
                className='mx-1'
                priority
              />
              Vercel
            </Link>
            <span>and</span>
            <Link href="https://v0.dev/" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline flex items-center">
              <Image
                width={16}
                height={16}
                src='/logo-cache/v0.webp'
                alt='V0 Logo'
                priority
              />
            </Link>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Link 
              href="https://github.com/Kaustubh-Natuskar/moreThanFAANGM/graphs/contributors" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 font-medium hover:underline"
            >
              <Image
                width={20}
                height={20}
                src='/logo-cache/github.webp'
                alt='Github Logo'
                priority
              />
              <span>Data Thanks to ❤️</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
