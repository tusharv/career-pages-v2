import Link from 'next/link'
import { ExternalLink, Flame, MapPin, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { RemoteJob } from '@/lib/types/remote-job'

/** Fixed locale + UTC so server and client markup agree. */
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatPostedAt(iso: string | null): string | null {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date)
}

function formatRate(rate: RemoteJob['hourlyRate']): string | null {
  if (!rate) return null
  return rate.min === rate.max
    ? `$${rate.min}/hr`
    : `$${rate.min}–$${rate.max}/hr`
}

export function RemoteJobCard({
  job,
  className,
}: {
  job: RemoteJob
  className?: string
}) {
  const postedAt = formatPostedAt(job.postedAt)
  const rate = formatRate(job.hourlyRate)

  return (
    <Card
      className={cn(
        'flex h-full flex-col border-border/80 shadow-sm motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-primary/20 motion-safe:hover:shadow-lg',
        className
      )}
    >
      <CardHeader className="pb-2 pt-6">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">{job.categoryLabel}</Badge>
          {job.highDemand ? (
            <Badge
              variant="outline"
              className="gap-1 border-[hsl(var(--chart-1))]/50 text-[hsl(var(--chart-5))]"
            >
              <Flame className="h-3 w-3" aria-hidden />
              High demand
            </Badge>
          ) : null}
        </div>
        <CardTitle className="mt-2 text-base leading-snug">
          <Link
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md outline-none ring-offset-background transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="line-clamp-2">{job.title}</span>
          </Link>
        </CardTitle>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">
          {job.company} ·{' '}
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" aria-hidden />
            Remote
          </span>
          {job.engagement ? ` · ${job.engagement.replace('-', ' ')}` : null}
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        {job.skills.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {job.skills.slice(0, 4).map((skill) => (
              <li
                key={skill}
                className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground"
              >
                {skill}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {rate ? (
            <span className="font-semibold tabular-nums text-foreground">
              {rate}
            </span>
          ) : null}
          {job.openings && job.openings > 1 ? (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" aria-hidden />
              {job.openings} openings
            </span>
          ) : null}
          {postedAt ? <span>Posted {postedAt}</span> : null}
        </div>

        <Button asChild size="sm" className="w-full gap-1.5">
          <Link href={job.url} target="_blank" rel="noopener noreferrer">
            Apply
            <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
