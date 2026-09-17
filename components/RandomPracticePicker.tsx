"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Shuffle, Lightbulb, ExternalLink } from "lucide-react";

type PracticeItem = {
  title: string;
  courseUrl?: string;
  prompt: string;
  twist: string;
  takeaway?: string;
  steps?: readonly { title: string; body: string }[];
};

// All variants participate in sizing at the current viewport/font size.
// Hidden variants cannot be read by assistive technology or interacted with.
function StableContent({
  items,
  index,
  render,
}: {
  items: readonly PracticeItem[];
  index: number;
  render: (item: PracticeItem) => ReactNode;
}) {
  return (
    <div className="grid min-w-0">
      {items.map((item, position) => (
        <div
          key={item.title}
          aria-hidden={position !== index ? true : undefined}
          className={`col-start-1 row-start-1 min-w-0 ${position === index ? "visible" : "invisible pointer-events-none select-none"}`}
        >
          {render(item)}
        </div>
      ))}
    </div>
  );
}

export function RandomPracticePicker({
  items,
  label,
  buttonLabel,
  cardLabel = "A prompt to play with",
}: {
  items: readonly PracticeItem[];
  label: string;
  buttonLabel: string;
  cardLabel?: string;
}) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(Math.floor(Math.random() * items.length));
  }, [items.length]);

  const courseUrl = items[index].courseUrl;
  return (
    <div>
      {courseUrl ? (
        <div className="mb-6 max-w-xl">
          <label
            htmlFor="scrimba-course"
            className="mb-2 block text-sm font-medium"
          >
            Choose a course for what you want to learn
          </label>
          <select
            id="scrimba-course"
            value={index}
            onChange={(event) => setIndex(Number(event.target.value))}
            className="min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            {items.map((course, position) => (
              <option key={course.title} value={position}>
                {course.title}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Course links are referral links; Career Pages may receive a benefit.
            Choose by your starting skills and check the course page for current
            access and syllabus details.
          </p>
        </div>
      ) : null}
      <div aria-live="polite" aria-atomic="true">
        <StableContent
          items={items}
          index={index}
          render={(item) => (
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Try this: {item.title}
            </h2>
          )}
        />
      </div>
      <div className="mt-7 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="min-w-0 rounded-xl border border-border bg-background/60 p-5 md:p-7">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Your game plan
          </p>
          <StableContent
            items={items}
            index={index}
            render={(item) => (
              <ol className="space-y-6">
                {item.steps?.map((step, number) => (
                  <li key={step.title} className="flex gap-3">
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold"
                    >
                      {number + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          />
        </div>
        <aside className="flex min-w-0 flex-col rounded-xl border border-amber-300 bg-amber-50 p-5 text-slate-900 md:p-7">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-900">
            <Lightbulb className="h-4 w-4 shrink-0" aria-hidden />
            {cardLabel}
          </p>
          <p className="mt-3 text-xs text-amber-900">{label}</p>
          <div className="mt-5">
            <StableContent
              items={items}
              index={index}
              render={(item) => (
                <p className="select-text text-base leading-relaxed">
                  {item.prompt}
                </p>
              )}
            />
          </div>
          <div className="mt-5 border-t border-amber-300 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-900">
              For your portfolio
            </p>
            <StableContent
              items={items}
              index={index}
              render={(item) => (
                <p className="text-sm leading-relaxed text-slate-700">
                  {item.takeaway}
                </p>
              )}
            />
          </div>
          <div className="mt-auto pt-6">
            {courseUrl ? (
              <a
                href={courseUrl}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="mb-3 flex min-h-11 w-fit items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800"
              >
                View course on Scrimba
                <ExternalLink className="h-4 w-4" aria-hidden />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}
            <button
              type="button"
              onClick={() =>
                setIndex(
                  (current) =>
                    (current +
                      1 +
                      Math.floor(Math.random() * (items.length - 1))) %
                    items.length,
                )
              }
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-amber-800/30 bg-white/70 px-4 py-2 text-sm font-semibold hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800"
            >
              <Shuffle className="h-4 w-4" aria-hidden />
              {buttonLabel}
            </button>
            <details className="mt-5 border-t border-amber-300 pt-4">
              <summary className="cursor-pointer rounded-sm text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-800">
                Fancy a small twist?
              </summary>
              <div className="mt-3">
                <StableContent
                  items={items}
                  index={index}
                  render={(item) => (
                    <p className="text-sm leading-relaxed text-slate-700">
                      {item.twist}
                    </p>
                  )}
                />
              </div>
            </details>
          </div>
        </aside>
      </div>
    </div>
  );
}
