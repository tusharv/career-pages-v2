import {
  REMOTE_JOB_CATEGORIES,
  type RemoteJob,
  type RemoteJobCategory,
} from "@/lib/types/remote-job";

/**
 * Remote technical roles from micro1's public referral listing.
 * The referral code is part of a shareable public link, not a secret; override
 * it with MICRO1_REFERRAL_CODE to credit a different account.
 */
const DEFAULT_REFERRAL_CODE = "2ecf10a3-ed88-4b99-b4fd-765d206d291d";
const API_BASE_URL = "https://prod-api.micro1.ai/api/v1";
const REFERRAL_SITE_URL = "https://refer.micro1.ai/referral/jobs";
const UTM_PARAMS =
  "utm_source=referral&utm_medium=share&utm_campaign=job_referral";

/** The upstream caps page size at 100. */
const SOURCE_PAGE_SIZE = 100;
const MAX_SOURCE_PAGES = 8;
const SOURCE_TIMEOUT_MS = 10_000;
const CACHE_TTL_SECONDS = 3600;

const CATEGORY_LABELS = new Map<string, string>(
  REMOTE_JOB_CATEGORIES.map((c) => [c.id, c.label])
);

export function getReferralCode(): string {
  return process.env.MICRO1_REFERRAL_CODE || DEFAULT_REFERRAL_CODE;
}

export function getReferralSiteUrl(): string {
  return `${REFERRAL_SITE_URL}?referralCode=${encodeURIComponent(
    getReferralCode()
  )}&${UTM_PARAMS}`;
}

export function isRemoteJobCategory(
  value: string
): value is RemoteJobCategory {
  return CATEGORY_LABELS.has(value);
}

interface SourceJob {
  job_id?: unknown;
  job_name?: unknown;
  company_name?: unknown;
  apply_url?: unknown;
  domain_slug?: unknown;
  skills?: unknown;
  no_of_openings?: unknown;
  date_posted?: unknown;
  engagement_type?: unknown;
  is_high_demand_job?: unknown;
  ideal_hourly_rate?: unknown;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asPositiveInt(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number.parseInt(String(value), 10);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
}

/** Source dates look like `2026-09-11 21:43:44` (UTC, no offset). */
function toIsoDate(value: unknown): string | null {
  const raw = asString(value);
  if (!raw) return null;
  const parsed = new Date(raw.replace(" ", "T") + "Z");
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function toHourlyRate(value: unknown): { min: number; max: number } | null {
  if (!value || typeof value !== "object") return null;
  const { min, max } = value as { min?: unknown; max?: unknown };
  const lo = typeof min === "number" && min > 0 ? min : null;
  const hi = typeof max === "number" && max > 0 ? max : null;
  if (lo == null && hi == null) return null;
  const low = lo ?? (hi as number);
  const high = hi ?? (lo as number);
  return { min: Math.min(low, high), max: Math.max(low, high) };
}

function normalize(job: SourceJob): RemoteJob | null {
  const id = asString(job.job_id);
  const title = asString(job.job_name);
  const url = asString(job.apply_url);
  const domain = asString(job.domain_slug);
  if (!id || !title || !url || !domain) return null;

  // Only technical domains; everything else stays out of this section.
  const categoryLabel = CATEGORY_LABELS.get(domain);
  if (!categoryLabel) return null;

  // Never render an attacker-controllable scheme such as `javascript:`.
  if (!/^https:\/\//i.test(url)) return null;

  const skills = Array.isArray(job.skills)
    ? job.skills
        .map((s) => asString(s))
        .filter((s): s is string => s !== null)
        .slice(0, 8)
    : [];

  return {
    id,
    title,
    company: asString(job.company_name) ?? "micro1",
    url,
    category: domain as RemoteJobCategory,
    categoryLabel,
    skills,
    openings: asPositiveInt(job.no_of_openings),
    postedAt: toIsoDate(job.date_posted),
    hourlyRate: toHourlyRate(job.ideal_hourly_rate),
    engagement: asString(job.engagement_type),
    highDemand:
      job.is_high_demand_job === "1" || job.is_high_demand_job === 1,
  };
}

async function fetchSourcePage(page: number): Promise<SourceJob[]> {
  const url =
    `${API_BASE_URL}/job/portal/referral/${encodeURIComponent(
      getReferralCode()
    )}/jobs?page=${page}&limit=${SOURCE_PAGE_SIZE}`;

  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(SOURCE_TIMEOUT_MS),
    // Cacheable so /remote-jobs can prerender instead of bailing out to dynamic.
    next: { revalidate: CACHE_TTL_SECONDS, tags: ["remote-jobs"] },
  });
  if (!response.ok) {
    throw new Error(`micro1 responded with HTTP ${response.status}`);
  }
  const body = (await response.json()) as { data?: unknown };
  return Array.isArray(body.data) ? (body.data as SourceJob[]) : [];
}

/** All technical roles, newest first. Backed by the fetch cache, so at most hourly. */
export async function getRemoteJobs(): Promise<RemoteJob[]> {
  const jobs: RemoteJob[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= MAX_SOURCE_PAGES; page += 1) {
    const rows = await fetchSourcePage(page);
    for (const row of rows) {
      const job = normalize(row);
      if (job && !seen.has(job.id)) {
        seen.add(job.id);
        jobs.push(job);
      }
    }
    if (rows.length < SOURCE_PAGE_SIZE) break;
  }

  return jobs.sort((a, b) => (b.postedAt ?? "").localeCompare(a.postedAt ?? ""));
}

export function filterRemoteJobs(
  jobs: RemoteJob[],
  { search, category }: { search?: string; category?: RemoteJobCategory }
): RemoteJob[] {
  const q = (search ?? "").trim().toLowerCase();
  return jobs.filter((job) => {
    if (category && job.category !== category) return false;
    if (!q) return true;
    return (
      job.title.toLowerCase().includes(q) ||
      job.categoryLabel.toLowerCase().includes(q) ||
      job.skills.some((s) => s.toLowerCase().includes(q))
    );
  });
}
