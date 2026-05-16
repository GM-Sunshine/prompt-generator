"use client";

import { useEffect, useRef, useState } from "react";

type Example = {
  category: string;
  chips: string[];
  prompt: string;
};

const EXAMPLES: Example[] = [
  {
    category: "Software Development",
    chips: ["Next.js", "TypeScript", "Stripe", "Tests"],
    prompt: `You are a senior full-stack engineer. Build a
production-grade SaaS application called "Acme".

## Tech stack
- Platform: Next.js · Language: TypeScript
- Billing: Stripe subscriptions with a free tier
- Automated tests for core flows + a README`,
  },
  {
    category: "Content & Writing",
    chips: ["Blog post", "Developers", "Conversational"],
    prompt: `You are an expert writer and editor. Write a
blog post.

## Audience & voice
- Audience: software developers
- Tone: conversational · Length: ~1200 words
- Lead with a hook; no throat-clearing.`,
  },
  {
    category: "Data & Analysis",
    chips: ["PostgreSQL", "Explain", "Performance"],
    prompt: `You are an expert data engineer. Write a
PostgreSQL SQL query.

## Requirements
- Correct, deterministic, readable (CTEs)
- Optimize for performance; note useful indexes
- Explain the query and any assumptions made.`,
  },
];

const INTERVAL = 4200;

export function HeroSpecimen() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reduced.current) return;
    const t = setInterval(
      () => setI((p) => (p + 1) % EXAMPLES.length),
      INTERVAL,
    );
    return () => clearInterval(t);
  }, [paused]);

  const ex = EXAMPLES[i];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* soft offset slab for depth */}
      <div className="absolute -bottom-4 -right-3 left-6 top-8 -z-10 rounded-2xl bg-accent/60" />

      <div className="card-soft overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <div key={`tag-${i}`} className="animate-in fade-in duration-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {ex.category}
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary/70" />
            live preview
          </span>
        </div>

        <div
          key={`chips-${i}`}
          className="flex flex-wrap gap-1.5 px-5 pb-1 pt-4 animate-in fade-in slide-in-from-bottom-1 duration-500"
        >
          {ex.chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-y-4 left-0 w-[3px] rounded-r bg-primary" />
          <pre
            key={`p-${i}`}
            className="mono whitespace-pre-wrap px-6 py-4 text-[12.5px] leading-[1.7] text-foreground/80 animate-in fade-in duration-700"
          >
            {ex.prompt}
          </pre>
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <div className="flex gap-1.5">
            {EXAMPLES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Show example ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === i
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-border hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            assembled from JSON
          </span>
        </div>
      </div>
    </div>
  );
}
