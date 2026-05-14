import {
  Building2,
  Globe2,
  Users,
  Target,
  Sparkles,
  LineChart,
  Link2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { CompanyMetaProfile } from "@/lib/types/company-meta";
import {
  collectMetaSourceUrls,
  formatMajorOffices,
  metaPresent,
} from "@/lib/company-meta";

type Props = { meta: CompanyMetaProfile };

function MetaParagraph({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
    </div>
  );
}

function SourceLinkList({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;
  return (
    <ul className="list-inside list-disc space-y-1.5 text-sm text-primary">
      {urls.map((href) => (
        <li key={href} className="break-all">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:underline"
          >
            {href}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function CompanyMetaSections({ meta }: Props) {
  const hq = metaPresent(meta.hq);
  const offices = formatMajorOffices(meta.major_offices);
  const domain = metaPresent(meta.domain);
  const website = metaPresent(meta.website);
  const founding = metaPresent(meta.about?.founding_year);
  const headcount = metaPresent(meta.about?.employee_count);
  const core = metaPresent(meta.about?.core_products_services);
  const mission = metaPresent(meta.culture?.mission);
  const values = metaPresent(meta.culture?.values);
  const glassdoor = metaPresent(meta.culture?.glassdoor_summary);
  const linkedin = metaPresent(meta.culture?.linkedin_insights);
  const leadership = meta.leadership ?? [];
  const o = meta.others;
  const otherPairs: { label: string; value: string }[] = [];
  const pushOther = (label: string, v: string | undefined) => {
    const t = metaPresent(v);
    if (t) otherPairs.push({ label, value: t });
  };
  if (o) {
    pushOther("Financials", o.financials);
    pushOther("Funding", o.funding);
    pushOther("Customers & partners", o.major_customers_partners);
    pushOther("Recent news", o.recent_news);
    pushOther("Regulatory", o.regulatory_issues);
    pushOther("Patents", o.patents);
    pushOther("M&A", o.mna_activity);
  }

  const sources = collectMetaSourceUrls(meta);
  const showAmbiguity =
    meta.ambiguity_flag === true || !!metaPresent(meta.ambiguity_notes);
  const ambiguityText = metaPresent(meta.ambiguity_notes);

  const hasQuickFacts =
    hq || offices || domain || website || founding || headcount;
  const hasCulture = mission || values || glassdoor || linkedin;

  const fs = meta.file_supplement;
  const hasFileSupplement =
    !!fs &&
    (fs.from_recovered_name_index === true ||
      !!metaPresent(fs.coverage_note) ||
      !!metaPresent(fs.executive_summary_excerpt) ||
      !!metaPresent(fs.limitations_excerpt) ||
      !!fs.comparative_employee ||
      !!fs.comparative_scale ||
      !!metaPresent(fs.comparative_chart_mermaid));

  return (
    <div className="flex flex-col gap-8">
      {showAmbiguity ? (
        <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500" />
          <div className="space-y-1">
            <p className="font-medium">Data quality note</p>
            {ambiguityText ? (
              <p className="leading-relaxed text-muted-foreground">{ambiguityText}</p>
            ) : (
              <p className="leading-relaxed text-muted-foreground">
                Some fields may be incomplete or ambiguous for this company.
              </p>
            )}
          </div>
        </div>
      ) : null}

      {hasQuickFacts ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Building2 className="h-5 w-5 shrink-0 text-muted-foreground" />
            At a glance
          </h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {domain ? (
              <>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Industry / focus
                </dt>
                <dd className="text-sm leading-relaxed sm:col-span-1">{domain}</dd>
              </>
            ) : null}
            {hq ? (
              <>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Headquarters
                </dt>
                <dd className="text-sm leading-relaxed">{hq}</dd>
              </>
            ) : null}
            {offices ? (
              <>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Major offices
                </dt>
                <dd className="text-sm leading-relaxed">{offices}</dd>
              </>
            ) : null}
            {founding ? (
              <>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Founded
                </dt>
                <dd className="text-sm leading-relaxed">{founding}</dd>
              </>
            ) : null}
            {headcount ? (
              <>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Team size
                </dt>
                <dd className="text-sm leading-relaxed">{headcount}</dd>
              </>
            ) : null}
            {website ? (
              <>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Corporate site
                </dt>
                <dd className="text-sm">
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                  >
                    <Globe2 className="h-3.5 w-3.5 shrink-0" />
                    {website}
                  </a>
                </dd>
              </>
            ) : null}
          </dl>
        </section>
      ) : null}

      {core ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 shrink-0 text-muted-foreground" />
            What they do
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{core}</p>
        </section>
      ) : null}

      {leadership.length > 0 ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Users className="h-5 w-5 shrink-0 text-muted-foreground" />
            Leadership
          </h2>
          <ul className="space-y-3">
            {leadership.map((person, i) => (
              <li
                key={`${person.name}-${person.title}-${i}`}
                className="rounded-lg border border-border/70 bg-muted/20 px-4 py-3"
              >
                <p className="font-medium text-foreground">{person.name}</p>
                <p className="text-sm text-muted-foreground">{person.title}</p>
                {person.source_url ? (
                  <p className="mt-2 text-xs">
                    <a
                      href={person.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Source
                    </a>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasCulture ? (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Target className="h-5 w-5 shrink-0 text-muted-foreground" />
            Mission & culture
          </h2>
          <div className="space-y-4">
            {mission ? <MetaParagraph label="Mission" value={mission} /> : null}
            {values ? <MetaParagraph label="Values" value={values} /> : null}
            {linkedin ? (
              <MetaParagraph label="Scale & positioning" value={linkedin} />
            ) : null}
            {glassdoor ? (
              <MetaParagraph label="Glassdoor (summary)" value={glassdoor} />
            ) : null}
          </div>
        </section>
      ) : null}

      {otherPairs.length > 0 ? (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <LineChart className="h-5 w-5 shrink-0 text-muted-foreground" />
            Spotlight
          </h2>
          <div className="space-y-4">
            {otherPairs.map((row) => (
              <MetaParagraph key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        </section>
      ) : null}

      {hasFileSupplement && fs ? (
        <>
          <Separator />
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
              Additional context from project file
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Fields merged from other sections of{" "}
              <span className="font-mono text-foreground">public/company_meta.json</span>{" "}
              (index, methodology, or comparative metrics) when present.
            </p>
            {fs.from_recovered_name_index ? (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Recovered name list: </span>
                This company name appears in{" "}
                <span className="font-mono text-foreground">metadata.recovered_name_index</span>.
              </p>
            ) : null}
            {metaPresent(fs.coverage_note) ? (
              <MetaParagraph label="Coverage (metadata)" value={fs.coverage_note!} />
            ) : null}
            {metaPresent(fs.executive_summary_excerpt) ? (
              <MetaParagraph
                label="Executive summary (excerpt)"
                value={fs.executive_summary_excerpt!}
              />
            ) : null}
            {metaPresent(fs.limitations_excerpt) ? (
              <MetaParagraph
                label="Methodology & limitations (excerpt)"
                value={fs.limitations_excerpt!}
              />
            ) : null}
            {fs.comparative_employee ? (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Comparative — team size
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {fs.comparative_employee.value}
                  {metaPresent(fs.comparative_employee.metric_as_of) ? (
                    <>
                      <br />
                      <span className="text-xs">{fs.comparative_employee.metric_as_of}</span>
                    </>
                  ) : null}
                </p>
                {fs.comparative_employee.source_urls?.length ? (
                  <SourceLinkList urls={fs.comparative_employee.source_urls} />
                ) : null}
              </div>
            ) : null}
            {fs.comparative_scale ? (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Comparative — scale metric
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {fs.comparative_scale.metric}:{" "}
                  </span>
                  {fs.comparative_scale.value}
                </p>
                {fs.comparative_scale.source_urls?.length ? (
                  <SourceLinkList urls={fs.comparative_scale.source_urls} />
                ) : null}
              </div>
            ) : null}
            {metaPresent(fs.comparative_chart_mermaid) ? (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Comparative chart (Mermaid source)
                </h3>
                <pre className="max-h-64 overflow-auto rounded-md border border-border bg-muted/40 p-3 text-xs leading-relaxed">
                  {fs.comparative_chart_mermaid}
                </pre>
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      {sources.length > 0 ? (
        <>
          <Separator />
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Link2 className="h-5 w-5 shrink-0 text-muted-foreground" />
              Sources
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              References compiled for this profile. Treat figures and news as
              time-sensitive unless you verify the original source.
            </p>
            <SourceLinkList urls={sources} />
          </section>
        </>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Empty or &quot;unspecified&quot; fields are hidden. Figures and news may be
        time-sensitive—verify on the original source when it matters.
      </p>
    </div>
  );
}
