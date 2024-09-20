import Image from 'next/image'
import Link from 'next/link'

export function Header(){
    return (
        <header className="border-b">
        
          <Link href="/">
            <div className="container mx-auto px-4 py-4 flex justify-start items-center space-x-4">
              <Image
                width={36}
                height={36}
                src='/career.svg'
                alt='Career Pages Logo'
                priority
              />
              <h1 className="text-2xl font-bold">Career Pages</h1>
            </div>
          </Link>
      </header>
    )
}
