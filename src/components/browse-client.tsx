"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import type { GeneratorIndexItem } from "@/lib/data";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function BrowseClient({
  items,
  groups,
}: {
  items: GeneratorIndexItem[];
  groups: string[];
}) {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string | null>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((it) => {
      if (group && it.group !== group) return false;
      if (!needle) return true;
      return (
        it.label.toLowerCase().includes(needle) ||
        it.description.toLowerCase().includes(needle) ||
        it.categoryLabel.toLowerCase().includes(needle)
      );
    });
  }, [items, q, group]);

  const byCategory = useMemo(() => {
    const m = new Map<string, GeneratorIndexItem[]>();
    for (const it of results) {
      if (!m.has(it.categoryLabel)) m.set(it.categoryLabel, []);
      m.get(it.categoryLabel)!.push(it);
    }
    return [...m.entries()];
  }, [results]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${items.length} generators…`}
            className="w-full rounded-full border border-border bg-card py-3.5 pl-11 pr-11 text-[0.95rem] shadow-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setGroup(null)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              !group
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {groups.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroup(g === group ? null : g)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                group === g
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {g}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          {results.length} generator{results.length === 1 ? "" : "s"}
          {group ? ` in ${group}` : ""}
          {q ? ` matching “${q}”` : ""}
        </p>
      </div>

      {byCategory.length === 0 && (
        <p className="rounded-lg border border-border bg-card px-5 py-8 text-center text-muted-foreground">
          Nothing matches yet. Try a different term — or{" "}
          <Link href="/contribute" className="text-primary underline">
            contribute this generator
          </Link>
          .
        </p>
      )}

      <div className="space-y-10">
        {byCategory.map(([catLabel, list]) => (
          <div key={catLabel} className="space-y-3">
            <div className="flex items-baseline gap-3 border-b border-border pb-2">
              <h2 className="font-display text-xl tracking-tight">
                {catLabel}
              </h2>
              <span className="text-sm text-muted-foreground">
                {list.length}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((it) => (
                <Link
                  key={`${it.category}/${it.id}`}
                  href={`/${it.category}/${it.id}`}
                  className="card-soft group flex flex-col gap-2 p-5"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      name={it.icon}
                      className="size-[1.05rem] text-muted-foreground transition-colors group-hover:text-primary"
                    />
                    <h3 className="font-display text-lg tracking-tight">
                      <span className="ulink">{it.label}</span>
                    </h3>
                  </div>
                  <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {it.description}
                  </p>
                  <span className="inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary">
                    Open
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
