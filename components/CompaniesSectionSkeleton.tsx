import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const PLACEHOLDER_CARD_DEFAULT = 12

type CompaniesSectionSkeletonProps = {
  /** Match home page pagination so grid height matches first paint after load */
  cardCount?: number
}

function CompanyCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        'relative border-border/80 shadow-sm pointer-events-none select-none',
        className
      )}
    >
      <CardHeader className="pb-2 pt-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-[min(100%,14rem)]" />
            <Skeleton className="h-4 w-[min(100%,10rem)]" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5 pt-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Skeleton className="h-4 w-[4.5rem]" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-2.5">
          <Skeleton className="h-8 w-[4.25rem] rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

export function CompaniesSectionSkeleton({
  cardCount = PLACEHOLDER_CARD_DEFAULT,
}: CompaniesSectionSkeletonProps) {
  return (
    <section
      className="container mx-auto px-4 py-10 md:py-14"
      aria-busy="true"
      aria-label="Loading companies"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl space-y-3">
          <Skeleton className="h-9 w-48 md:h-10 md:w-56" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </div>
        <div
          className="flex h-11 w-full gap-1 rounded-xl bg-muted/80 p-1 sm:w-auto sm:shrink-0"
          aria-hidden
        >
          <Skeleton className="h-9 flex-1 rounded-lg sm:w-24 sm:flex-none" />
          <Skeleton className="h-9 flex-1 rounded-lg sm:w-28 sm:flex-none" />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2" aria-hidden>
        <Skeleton className="h-3 w-48 max-w-full" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {Array.from({ length: cardCount }, (_, i) => (
          <CompanyCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}
