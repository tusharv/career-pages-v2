import { unstable_cache } from "next/cache";
import snapshotFile from "@/lib/data/peerlist-remote-jobs.json";
import {
  REMOTE_JOB_CATEGORIES,
  type RemoteJob,
  type RemoteJobCategory,
} from "@/lib/types/remote-job";

/**
 * Recent remote engineering roles from Peerlist's public job board.
 * https://peerlist.io/jobs is behind a Cloudflare challenge from servers, so a
 * live fetch is tried on each cache refresh and the saved list is used when
 * that request does not return JSON.
 */
export const PEERLIST_REMOTE_JOBS_URL = "https://peerlist.io/jobs/role/remote";

const API_URL = "https://peerlist.io/api/v1/jobs";
const MAX_JOBS = 40;
const MAX_PAGES = 3;
const SOURCE_TIMEOUT_MS = 8_000;
const CACHE_TTL_SECONDS = 3600;

const CATEGORY_LABELS = new Map<RemoteJobCategory, string>(
  REMOTE_JOB_CATEGORIES.map((c) => [c.id, c.label])
);

interface PeerlistSalary {
  min: number | null;
  max: number | null;
  currency: string | null;
  unit: string | null;
}

interface PeerlistJobRecord {
  id: string;
  title: string;
  company: string | null;
  handle: string | null;
  type: string | null;
  department: string | null;
  roles: string[];
  skills: string[];
  locations: string[];
  publishedAt: string | null;
  applyLink: string | null;
  salary: PeerlistSalary | null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asPositive(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : null;
}

function names(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return asString(item);
      if (item && typeof item === "object" && "name" in item) {
        return asString((item as { name?: unknown }).name);
      }
      return null;
    })
    .filter((name): name is string => name !== null);
}

function toRecord(value: unknown): PeerlistJobRecord | null {
  if (!value || typeof value !== "object") return null;
  const job = value as Record<string, unknown>;
  const id = asString(job.id) ?? asString(job.jobId);
  const title = asString(job.title) ?? asString(job.jobTitle);
  if (!id || !title) return null;

  const company =
    job.company && typeof job.company === "object"
      ? (job.company as { name?: unknown; profileHandle?: unknown })
      : null;

  const locations = Array.isArray(job.locations)
    ? job.locations.map((item) => asString(item)).filter((item): item is string => item !== null)
    : Array.isArray(job.location)
      ? job.location
          .map((item) => {
            if (!item || typeof item !== "object") return null;
            const place = item as { city?: unknown; country?: unknown };
            const city = asString(place.city);
            const country = asString(place.country);
            return [city, country].filter(Boolean).join(", ") || null;
          })
          .filter((item): item is string => item !== null)
      : [];

  const rawSalary =
    job.salary && typeof job.salary === "object"
      ? (job.salary as { min?: unknown; max?: unknown; currency?: unknown; unit?: unknown })
      : null;

  return {
    id,
    title,
    company: company ? asString(company.name) : asString(job.company),
    handle: company ? asString(company.profileHandle) : asString(job.handle),
    type: asString(job.type) ?? asString(job.jobType),
    department: asString(job.department),
    roles: Array.isArray(job.roles) && job.roles.every((role) => typeof role === "string")
      ? (job.roles as string[])
      : names(job.roles),
    skills: Array.isArray(job.skills) && job.skills.every((skill) => typeof skill === "string")
      ? (job.skills as string[])
      : names(job.skills),
    locations,
    publishedAt: asString(job.publishedAt),
    applyLink: asString(job.applyLink),
    salary: rawSalary
      ? {
          min: asPositive(rawSalary.min),
          max: asPositive(rawSalary.max),
          currency: asString(rawSalary.currency),
          unit: asString(rawSalary.unit),
        }
      : null,
  };
}

function isTechnical(job: PeerlistJobRecord): boolean {
  const department = (job.department ?? "").toUpperCase();
  if (["DESIGN", "MARKETING", "SALES", "HR", "FINANCE", "LEGAL"].includes(department)) {
    return false;
  }
  const blob = `${job.title} ${job.roles.join(" ")}`;
  if (
    /designer|product manager|recruiter|marketing|\bsales\b/i.test(job.title) &&
    !/engineer|developer/i.test(job.title)
  ) {
    return false;
  }
  if (["ENGINEERING", "DATA", "SECURITY", "TECHNOLOGY", "IT"].includes(department)) {
    return true;
  }
  return /engineer|developer|software|data|security|machine learning|devops|\bsre\b|full[ -]?stack|frontend|backend/i.test(
    blob
  );
}

function categoryFor(job: PeerlistJobRecord): RemoteJobCategory {
  const blob = `${job.title} ${job.roles.join(" ")}`.toLowerCase();
  if (/security|cyber|pentest|appsec|devsecops/.test(blob)) return "cybersecurity";
  if (/\bai\b|machine learning|\bml\b|\bllm\b/.test(blob)) return "ai-machine-learning";
  if (/data engineer|data analyst|data scientist|analytics|data foundation/.test(blob)) {
    return "data-analysis";
  }
  return "software-engineering";
}

function formatLocations(locations: string[]): string | null {
  const unique = Array.from(
    new Set(locations.map((item) => item.trim()).filter(Boolean))
  );
  if (unique.length === 0) return null;
  if (unique.length === 1) return unique[0];
  return `${unique[0]} +${unique.length - 1}`;
}

function jobUrl(job: PeerlistJobRecord): string | null {
  if (job.applyLink && /^https:\/\//i.test(job.applyLink)) return job.applyLink;
  if (job.handle && /^[a-z0-9_]+$/i.test(job.handle)) {
    return `https://peerlist.io/company/${job.handle}`;
  }
  return null;
}

function payFrom(salary: PeerlistSalary | null): {
  hourlyRate: RemoteJob["hourlyRate"];
  yearlySalary: RemoteJob["yearlySalary"];
} {
  const empty = { hourlyRate: null, yearlySalary: null };
  if (!salary) return empty;
  const min = salary.min;
  const max = salary.max;
  if (min == null && max == null) return empty;

  const unit = (salary.unit ?? "").toLowerCase();
  const low = min ?? (max as number);
  const high = max ?? min;
  const hourly = /hour/.test(unit);
  const yearly =
    /year|annual/.test(unit) || (!unit && Math.max(low, high ?? low) >= 10_000);

  if (hourly) {
    const hi = high ?? low;
    return {
      hourlyRate: { min: Math.min(low, hi), max: Math.max(low, hi) },
      yearlySalary: null,
    };
  }
  if (!yearly) return empty;
  return {
    hourlyRate: null,
    yearlySalary: {
      min: low,
      max: max == null ? null : Math.max(low, max),
      currency: salary.currency || "USD",
    },
  };
}

export function normalizePeerlistJob(job: PeerlistJobRecord): RemoteJob | null {
  const url = jobUrl(job);
  if (!url || !isTechnical(job)) return null;
  const category = categoryFor(job);
  const pay = payFrom(job.salary);
  const posted = job.publishedAt ? new Date(job.publishedAt) : null;

  return {
    id: `peerlist:${job.id}`,
    title: job.title,
    company: job.company || "Peerlist",
    url,
    category,
    categoryLabel: CATEGORY_LABELS.get(category) ?? "Software",
    skills: job.skills.slice(0, 8),
    openings: null,
    postedAt: posted && !Number.isNaN(posted.getTime()) ? posted.toISOString() : null,
    hourlyRate: pay.hourlyRate,
    yearlySalary: pay.yearlySalary,
    location: formatLocations(job.locations),
    engagement: job.type,
    highDemand: false,
    source: "peerlist",
  };
}

function jobsFromSnapshot(): RemoteJob[] {
  return snapshotFile.jobs
    .map((job) => toRecord(job))
    .filter((job): job is PeerlistJobRecord => job !== null)
    .map((job) => normalizePeerlistJob(job))
    .filter((job): job is RemoteJob => job !== null)
    .slice(0, MAX_JOBS);
}

async function fetchLivePeerlistJobs(): Promise<RemoteJob[]> {
  const records: PeerlistJobRecord[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const params = new URLSearchParams({ remoteOnly: "true" });
    if (cursor) params.set("cursor", cursor);

    const response = await fetch(`${API_URL}?${params}`, {
      headers: {
        accept: "application/json",
        "user-agent": "CareerPages/1.0 (remote-jobs)",
      },
      signal: AbortSignal.timeout(SOURCE_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`peerlist responded with HTTP ${response.status}`);
    }
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new Error("peerlist did not return JSON");
    }

    const body = (await response.json()) as {
      success?: unknown;
      data?: { jobs?: unknown; cursor?: unknown };
    };
    const rows = body.data?.jobs;
    if (body.success !== true || !Array.isArray(rows)) {
      throw new Error("peerlist payload was not a job list");
    }

    for (const row of rows) {
      const record = toRecord(row);
      if (record && isTechnical(record)) records.push(record);
    }

    const next = asString(body.data?.cursor);
    if (!next || next === cursor || rows.length === 0 || records.length >= MAX_JOBS) {
      break;
    }
    cursor = next;
  }

  const seen = new Set<string>();
  const jobs: RemoteJob[] = [];
  for (const record of records) {
    const job = normalizePeerlistJob(record);
    if (job && !seen.has(job.id)) {
      seen.add(job.id);
      jobs.push(job);
    }
  }

  return jobs
    .sort((a, b) => (b.postedAt ?? "").localeCompare(a.postedAt ?? ""))
    .slice(0, MAX_JOBS);
}

async function loadPeerlistJobs(): Promise<RemoteJob[]> {
  try {
    const live = await fetchLivePeerlistJobs();
    if (live.length > 0) return live;
  } catch (error) {
    console.error("Peerlist jobs unavailable, using the saved list", error);
  }
  return jobsFromSnapshot();
}

/** Up to 40 recent remote engineering roles. Cached for an hour, snapshot on failure. */
export const getPeerlistJobs = unstable_cache(loadPeerlistJobs, ["peerlist-remote-jobs-v2"], {
  revalidate: CACHE_TTL_SECONDS,
  tags: ["remote-jobs"],
});
