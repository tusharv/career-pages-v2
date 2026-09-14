import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { NotFoundContent } from '@/components/NotFoundContent'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Page not found',
  description:
    'The page you are looking for does not exist on Career Pages. Head back to browse company career sites.',
  noIndex: true,
})

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <NotFoundContent />
      <Footer />
    </div>
  )
}
