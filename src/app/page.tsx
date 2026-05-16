import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import {
  getCategories,
  getCategoryGroups,
  getGeneratorIndex,
} from "@/lib/data";
import { Icon } from "@/components/icon";
import { HeroSpecimen } from "@/components/hero-specimen";

export default function HomePage() {
  const categories = getCategories();
  const groups = getCategoryGroups();
  const total = getGeneratorIndex().length;

  return (
    <div className="space-y-24">
      <section className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <p className="kicker reveal d1">Open-source prompt studio</p>

          <h1 className="reveal d2 font-display text-[3.2rem] leading-[1.03] tracking-tight sm:text-[4.6rem]">
            Write better prompts,{" "}
            <span className="italic text-primary">faster.</span>
          </h1>

          <p className="reveal d3 max-w-md text-lg leading-relaxed text-muted-foreground">
            Pick from {total} guided generators across {categories.length}{" "}
            categories. Answer a few questions and get a sharp, reusable prompt
            — tailored for ChatGPT, Cursor and more. No accounts, no API keys.
          </p>

          <div className="reveal d4 flex flex-wrap items-center gap-4 pt-1">
            <Link
              href="/browse"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]"
            >
              Browse all {total}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#categories"
              className="group inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-foreground"
            >
              <span className="ulink">{categories.length} categories</span>
              <ArrowDown className="size-4 text-muted-foreground transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>

          <p className="reveal d5 text-sm text-muted-foreground">
            5 export formats · entirely JSON-driven · community-extensible
          </p>
        </div>

        <div className="reveal d3 lg:pl-4">
          <HeroSpecimen />
        </div>
      </section>

      <section id="categories" className="scroll-mt-28 space-y-14">
        <div className="reveal d4 flex items-end justify-between border-b border-border pb-4">
          <h2 className="font-display text-2xl tracking-tight">
            Explore by category
          </h2>
          <Link
            href="/browse"
            className="text-sm font-medium text-primary"
          >
            <span className="ulink">See everything →</span>
          </Link>
        </div>

        {groups.map((grp) => (
          <div key={grp.group} className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {grp.group}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {grp.categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/${c.id}`}
                  className="card-soft group flex flex-col gap-4 p-6"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid size-11 place-items-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon name={c.icon} className="size-5" />
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {c.count}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-display text-xl tracking-tight">
                      {c.label}
                    </h4>
                    <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                      {c.description}
                    </p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-primary">
                    <span className="ulink">Open</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
