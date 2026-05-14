/**
 * Seeds `companies.company_meta` from `public/company_meta.json` using every
 * public slice we can map to a database row by normalized company name.
 *
 * Sources (highest tier wins per row, then file-level fields are merged in):
 * - `companies[]` — full profiles (optional `seed_match_names` on an entry matches extra DB company names during seed; not written to `company_meta`)
 * - `master_table[]` — short verified rows
 * - `ambiguities[]` — used only to match additional company rows by name (no debug copy written to `company_meta`)
 * - `metadata.recovered_name_index` — name list (default ON; adds minimal stubs; comparative metrics merged when matched)
 * - `metadata.comparative_data` — employee / revenue scale rows + mermaid snippet
 * - `executive_summary`, `limitations_and_methodology` — attached to recovered-name stubs
 *
 * Default: recovered-name index is applied. Pass `--no-name-index` to skip list-only stubs.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL (see scripts/load-env).
 */

import "./load-env";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import type {
  CompanyMetaFileSupplement,
  CompanyMetaProfile,
} from "../lib/types/company-meta";

type MasterTableRow = {
  name: string;
  hq_location?: string;
  domain_industry?: string;
  website?: string;
  ceo?: string;
  notes?: string;
};

type AmbiguityRow = {
  input_name: string;
  possible_matches?: string[];
  selected_match: string;
  reason: string;
};

type ComparativeEmployee = {
  name: string;
  value: string;
  metric_as_of?: string;
  source_urls?: string[];
};

type ComparativeRevenue = {
  name: string;
  metric: string;
  value: string;
  source_urls?: string[];
};

type CompanyMetaFile = {
  companies?: CompanyMetaProfile[];
  master_table?: MasterTableRow[];
  ambiguities?: AmbiguityRow[];
  executive_summary?: string;
  limitations_and_methodology?: string;
  metadata?: {
    recovered_name_index?: string[];
    coverage_note?: string;
    comparative_data?: {
      employee_count_available?: ComparativeEmployee[];
      revenue_or_scale_available?: ComparativeRevenue[];
      suggested_mermaid_bar_chart?: string;
    };
  };
};

const TIER_NAME_INDEX = 0;
const TIER_AMBIGUITY = 1;
const TIER_MASTER = 2;
const TIER_FULL = 3;

function norm(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

function metaPresentLocal(value: string | null | undefined): string | undefined {
  if (value == null) return undefined;
  const t = value.trim();
  if (!t || /^unspecified$/i.test(t)) return undefined;
  return t;
}

function masterToProfile(row: MasterTableRow, dbName: string): CompanyMetaProfile {
  const hq = metaPresentLocal(row.hq_location);
  const domain = metaPresentLocal(row.domain_industry);
  const website = metaPresentLocal(row.website);
  const ceo = metaPresentLocal(row.ceo);
  const notes = metaPresentLocal(row.notes);
  const leadership =
    ceo != null
      ? [
          {
            name: ceo,
            title: "Chief Executive Officer",
          },
        ]
      : undefined;
  const others =
    notes != null
      ? {
          recent_news: notes,
        }
      : undefined;
  return {
    name: dbName,
    ...(hq ? { hq } : {}),
    ...(domain ? { domain } : {}),
    ...(website ? { website } : {}),
    ...(leadership ? { leadership } : {}),
    ...(others ? { others } : {}),
  };
}

function ambiguityToProfile(_a: AmbiguityRow, dbName: string): CompanyMetaProfile {
  return {
    name: dbName,
  };
}

function nameIndexStub(dbName: string): CompanyMetaProfile {
  return {
    name: dbName,
  };
}

function enrichProfileFromPublicFile(
  profile: CompanyMetaProfile,
  doc: CompanyMetaFile,
  dbName: string,
  _tier: number
): CompanyMetaProfile {
  const key = norm(dbName);
  const base: CompanyMetaFileSupplement = { ...(profile.file_supplement ?? {}) };

  const cd = doc.metadata?.comparative_data;
  const chart = metaPresentLocal(cd?.suggested_mermaid_bar_chart);
  const namesWithComparative = new Set<string>();

  for (const row of cd?.employee_count_available ?? []) {
    if (norm(row.name) === key) {
      namesWithComparative.add(key);
      base.comparative_employee = {
        value: row.value,
        ...(row.metric_as_of ? { metric_as_of: row.metric_as_of } : {}),
        ...(row.source_urls?.length ? { source_urls: row.source_urls } : {}),
      };
    }
  }
  for (const row of cd?.revenue_or_scale_available ?? []) {
    if (norm(row.name) === key) {
      namesWithComparative.add(key);
      base.comparative_scale = {
        metric: row.metric,
        value: row.value,
        ...(row.source_urls?.length ? { source_urls: row.source_urls } : {}),
      };
    }
  }
  if (namesWithComparative.has(key) && chart) {
    base.comparative_chart_mermaid = chart;
  }

  const empty =
    !base.from_recovered_name_index &&
    !metaPresentLocal(base.coverage_note) &&
    !metaPresentLocal(base.executive_summary_excerpt) &&
    !metaPresentLocal(base.limitations_excerpt) &&
    !base.comparative_employee &&
    !base.comparative_scale &&
    !metaPresentLocal(base.comparative_chart_mermaid);

  if (empty) {
    return profile;
  }
  return { ...profile, file_supplement: base };
}

function setIfHigher(
  pending: Map<string, { tier: number; profile: CompanyMetaProfile }>,
  id: string,
  tier: number,
  profile: CompanyMetaProfile
): void {
  const cur = pending.get(id);
  if (!cur || tier > cur.tier) {
    pending.set(id, { tier, profile });
  }
}

function collectIdsByNorm(
  byNorm: Map<string, { id: string; name: string }[]>,
  key: string
): { id: string; name: string }[] {
  return byNorm.get(norm(key)) ?? [];
}

async function main() {
  const useNameIndex = !process.argv.includes("--no-name-index");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (e.g. in .env.local)."
    );
    process.exit(1);
  }

  const path = resolve(process.cwd(), "public/company_meta.json");
  const doc = JSON.parse(readFileSync(path, "utf-8")) as CompanyMetaFile;

  const fullProfiles = doc.companies ?? [];
  const masterRows = doc.master_table ?? [];
  const ambiguities = doc.ambiguities ?? [];
  const recoveredNames = doc.metadata?.recovered_name_index ?? [];

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: rows, error } = await supabase
    .from("companies")
    .select("id, name");

  if (error || !rows) {
    console.error("Failed to load companies:", error?.message);
    process.exit(1);
  }

  const byNorm = new Map<string, { id: string; name: string }[]>();
  for (const r of rows) {
    const key = norm(String(r.name));
    if (!byNorm.has(key)) byNorm.set(key, []);
    byNorm.get(key)!.push({ id: r.id, name: r.name });
  }

  const pending = new Map<string, { tier: number; profile: CompanyMetaProfile }>();

  if (useNameIndex && recoveredNames.length > 0) {
    let stubHits = 0;
    for (const rawName of recoveredNames) {
      if (typeof rawName !== "string" || !rawName.trim()) continue;
      for (const m of collectIdsByNorm(byNorm, rawName)) {
        setIfHigher(pending, m.id, TIER_NAME_INDEX, nameIndexStub(m.name));
        stubHits += 1;
      }
    }
    console.log(
      `Queued name-index stubs: ${stubHits} row hit(s) from ${recoveredNames.length} index name(s).`
    );
  } else if (!useNameIndex && recoveredNames.length > 0) {
    console.log(
      `Skipping ${recoveredNames.length} recovered_name_index entries (--no-name-index).`
    );
  }

  for (const a of ambiguities) {
    if (!a?.input_name?.trim()) continue;
    const keys = new Set<string>();
    keys.add(norm(a.input_name));
    const sel = metaPresentLocal(a.selected_match);
    if (sel) keys.add(norm(sel));
    for (const k of Array.from(keys)) {
      const matches = byNorm.get(k);
      if (!matches) continue;
      for (const m of matches) {
        setIfHigher(pending, m.id, TIER_AMBIGUITY, ambiguityToProfile(a, m.name));
      }
    }
  }
  console.log(
    `Processed ${ambiguities.length} ambiguity row(s) (matched DB names by input_name / selected_match where applicable).`
  );

  for (const row of masterRows) {
    if (!row?.name?.trim()) continue;
    const matches = collectIdsByNorm(byNorm, row.name);
    if (!matches.length) {
      console.warn(`master_table: no DB row for "${row.name}"`);
      continue;
    }
    for (const m of matches) {
      setIfHigher(pending, m.id, TIER_MASTER, masterToProfile(row, m.name));
    }
  }
  console.log(`Applied master_table: ${masterRows.length} row(s).`);

  let fullHits = 0;
  for (const p of fullProfiles) {
    if (!p?.name?.trim()) continue;
    const extraNames = Array.isArray((p as CompanyMetaProfile).seed_match_names)
      ? ((p as CompanyMetaProfile).seed_match_names ?? []).filter(
          (x): x is string => typeof x === "string" && !!x.trim()
        )
      : [];
    const tryNames = [p.name, ...extraNames];
    const seenNorm = new Set<string>();
    const { seed_match_names: _omit, ...profileForDb } = p as CompanyMetaProfile & {
      seed_match_names?: string[];
    };
    for (const tryName of tryNames) {
      const n = norm(tryName);
      if (seenNorm.has(n)) continue;
      seenNorm.add(n);
      const matches = collectIdsByNorm(byNorm, tryName);
      if (!matches.length) continue;
      for (const m of matches) {
        setIfHigher(pending, m.id, TIER_FULL, { ...profileForDb, name: m.name });
        fullHits += 1;
      }
    }
    const primaryMatches = collectIdsByNorm(byNorm, p.name);
    if (!primaryMatches.length && extraNames.every((x) => !collectIdsByNorm(byNorm, x).length)) {
      console.warn(`companies[]: no DB row for "${p.name}"${extraNames.length ? ` or seed_match_names` : ""}`);
    }
  }
  console.log(
    `Applied companies[] full profiles: ${fullHits} DB row update(s) from ${fullProfiles.length} file object(s).`
  );

  let updated = 0;
  for (const [id, { tier, profile }] of Array.from(pending.entries())) {
    const row = rows.find((r) => r.id === id);
    const enriched = enrichProfileFromPublicFile(
      profile,
      doc,
      row?.name ?? profile.name,
      tier
    );
    const { error: uerr } = await supabase
      .from("companies")
      .update({ company_meta: enriched })
      .eq("id", id);
    if (uerr) {
      console.error(`Update failed for id ${id}:`, uerr.message);
      process.exit(1);
    }
    updated += 1;
    console.log(`Updated [tier ${tier}] ${row?.name ?? id}`);
  }

  console.log(
    `\nDone. ${updated} row(s) updated. comparative_data + methodology excerpts merged where applicable. Name-index stubs: ${useNameIndex ? "on (use --no-name-index to skip)" : "off"}.`
  );
}

main();
