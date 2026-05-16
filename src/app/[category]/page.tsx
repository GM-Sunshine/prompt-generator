import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  getCategories,
  getCategory,
  getGenerators,
} from "@/lib/data";
import { Icon } from "@/components/icon";

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return {
    title: `${cat.label} prompts — Prompt Generator`,
    description: cat.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const generators = getGenerators(category);
  const related = getCategories().filter(
    (c) => c.group === cat.group && c.id !== cat.id,
  );

  return (
    <div className="space-y-16">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/browse" className="hover:text-foreground">
          {cat.group ?? "Categories"}
        </Link>
        <span>/</span>
        <span className="text-foreground">{cat.label}</span>
      </nav>

      <header className="reveal d1 flex items-start gap-6">
        <span className="mt-1.5 grid size-14 shrink-0 place-items-center rounded-full bg-accent text-primary">
          <Icon name={cat.icon} className="size-7" />
        </span>
        <div className="max-w-2xl space-y-4">
          <p className="kicker">{cat.group ?? "Category"}</p>
          <h1 className="font-display text-5xl tracking-tight sm:text-6xl">
            {cat.label}
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {cat.description}
          </p>
        </div>
      </header>

      <section className="reveal d2 space-y-1">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <h2 className="font-display text-2xl tracking-tight">
            {generators.length} generators
          </h2>
          <Link href="/browse" className="text-sm font-medium text-primary">
            <span className="ulink">Browse all →</span>
          </Link>
        </div>

        <div>
          {generators.map((g, i) => (
            <Link
              key={g.id}
              href={`/${category}/${g.id}`}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-6 border-b border-border py-7 transition-colors hover:bg-accent/40"
            >
              <span className="font-display text-2xl text-muted-foreground/35 transition-colors group-hover:text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="space-y-1.5 px-1">
                <div className="flex items-center gap-2.5">
                  <Icon
                    name={g.icon}
                    className="size-[1.05rem] text-muted-foreground transition-colors group-hover:text-primary"
                  />
                  <h3 className="font-display text-[1.6rem] tracking-tight">
                    <span className="ulink">{g.label}</span>
                  </h3>
                </div>
                <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
                  {g.description}
                </p>
              </div>

              <ArrowRight className="size-5 text-muted-foreground transition-all group-hover:translate-x-1.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            More in {cat.group}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <Link
                key={c.id}
                href={`/${c.id}`}
                className="card-soft group flex items-center gap-3 p-5"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon name={c.icon} className="size-[1.05rem]" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg tracking-tight">
                    {c.label}
                  </h3>
                  <p className="truncate text-sm text-muted-foreground">
                    {c.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
