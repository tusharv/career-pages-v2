/** Technical role categories surfaced on /remote-jobs. */
export const REMOTE_JOB_CATEGORIES = [
  { id: "software-engineering", label: "Software" },
  { id: "ai-machine-learning", label: "AI & ML" },
  { id: "data-analysis", label: "Data" },
  { id: "cybersecurity", label: "Security" },
  { id: "applied-engineering", label: "Applied engineering" },
] as const;

export type RemoteJobCategory = (typeof REMOTE_JOB_CATEGORIES)[number]["id"];

/** Where a listing was pulled from. */
export const REMOTE_JOB_SOURCES = [
  { id: "micro1", label: "micro1" },
  { id: "peerlist", label: "Peerlist" },
] as const;

export type RemoteJobSource = (typeof REMOTE_JOB_SOURCES)[number]["id"];

export interface RemoteJob {
  id: string;
  title: string;
  company: string;
  /** Apply link carrying the referral code. */
  url: string;
  category: RemoteJobCategory;
  categoryLabel: string;
  skills: string[];
  openings: number | null;
  /** ISO timestamp, or null when the source date is unusable. */
  postedAt: string | null;
  hourlyRate: { min: number; max: number } | null;
  /** Annual pay. `max` is null when the listing only publishes a floor. */
  yearlySalary: { min: number; max: number | null; currency: string } | null;
  /** Country or city restriction for an otherwise remote role. */
  location: string | null;
  engagement: string | null;
  highDemand: boolean;
  source: "micro1" | "peerlist";
}

/** Paginated list from GET /api/remote-jobs */
export interface RemoteJobsPageResponse {
  data: RemoteJob[];
  total: number;
  page: number;
  pageSize: number;
  /** Total technical roles available before search/category filtering. */
  indexTotal: number;
  /** Referral listing on the source site, for the "browse all" link. */
  sourceUrl: string;
}
