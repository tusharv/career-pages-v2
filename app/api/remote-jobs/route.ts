import { NextResponse } from "next/server";
import {
  filterRemoteJobs,
  getReferralSiteUrl,
  getRemoteJobs,
  isRemoteJobCategory,
} from "@/lib/remote-jobs";
import type { RemoteJobsPageResponse } from "@/lib/types/remote-job";

const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
};

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 12;
const MAX_SEARCH_LEN = 160;

/** GET ?page=&limit=&q=&category= — paginated remote technical roles. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const rawPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const rawLimit = Number.parseInt(
    searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE),
    10
  );
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : DEFAULT_PAGE_SIZE
  );
  const q = (searchParams.get("q") ?? "").slice(0, MAX_SEARCH_LEN);
  const rawCategory = searchParams.get("category") ?? "";
  const category = isRemoteJobCategory(rawCategory) ? rawCategory : undefined;

  try {
    const all = await getRemoteJobs();
    const matches = filterRemoteJobs(all, { search: q, category });
    const from = (page - 1) * pageSize;

    const body: RemoteJobsPageResponse = {
      data: matches.slice(from, from + pageSize),
      total: matches.length,
      page,
      pageSize,
      indexTotal: all.length,
      sourceUrl: getReferralSiteUrl(),
    };

    return NextResponse.json(body, { headers: CACHE_HEADERS });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error(e);
    return NextResponse.json(
      { error: `Could not load remote jobs: ${message}` },
      { status: 502 }
    );
  }
}
