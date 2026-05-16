import type { Metadata } from "next";
import {
  getCategoryGroups,
  getGeneratorIndex,
} from "@/lib/data";
import { BrowseClient } from "@/components/browse-client";

export const metadata: Metadata = {
  title: "Browse all generators — Prompt Generator",
  description:
    "Search and filter every prompt generator across all categories.",
};

export default function BrowsePage() {
  const items = getGeneratorIndex();
  const groups = getCategoryGroups().map((g) => g.group);

  return (
    <div className="space-y-12">
      <header className="reveal d1 max-w-2xl space-y-4">
        <p className="kicker">The full catalog</p>
        <h1 className="font-display text-5xl tracking-tight sm:text-6xl">
          Browse all generators
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {items.length} guided prompt generators across{" "}
          {getCategoryGroups().reduce(
            (n, g) => n + g.categories.length,
            0,
          )}{" "}
          categories. Search by name, or filter by domain.
        </p>
      </header>

      <div className="reveal d2">
        <BrowseClient items={items} groups={groups} />
      </div>
    </div>
  );
}
