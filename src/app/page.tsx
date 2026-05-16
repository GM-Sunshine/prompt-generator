import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { getCategories, getGenerators } from "@/lib/data";
import { Icon } from "@/components/icon";
import { HeroSpecimen } from "@/components/hero-specimen";

export default function HomePage() {
  const categories = getCategories();
  const total = categories.reduce(
    (n, c) => n + getGenerators(c.id).length,
    0,
  );

  return (
    <div className="space-y-28">
      <section className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <p className="kicker reveal d1">Open-source prompt studio</p>

          <h1 className="reveal d2 font-display text-[3.2rem] leading-[1.03] tracking-tight sm:text-[4.6rem]">
            Write better prompts,{" "}
            <span className="italic text-primary">faster.</span>
          </h1>

          <p className="reveal d3 max-w-md text-lg leading-relaxed text-muted-foreground">
            Pick a category, answer a few guided questions, and Prompt Forge
            composes a sharp, reusable prompt — tailored for ChatGPT, Cursor
            and more. No accounts, no API keys.
          </p>

          <div className="reveal d4 flex flex-wrap items-center gap-4 pt-1">
            <Link
              href={`/${categories[0].id}`}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]"
            >
              Start building
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
            {total} guided generators · 5 export formats · entirely
            JSON-driven
          </p>
        </div>

        <div className="reveal d3 lg:pl-4">
          <HeroSpecimen />
        </div>
      </section>

      <section id="categories" className="scroll-mt-28 space-y-8">
        <div className="reveal d4 flex items-end justify-between border-b border-border pb-4">
          <h2 className="font-display text-2xl tracking-tight">
            Choose a category
          </h2>
          <span className="text-sm text-muted-foreground">
            {String(categories.length).padStart(2, "0")}
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {categories.map((c, i) => {
            const count = getGenerators(c.id).length;
            return (
              <Link
                key={c.id}
                href={`/${c.id}`}
                className={`card-soft group flex flex-col gap-5 p-8 reveal d${i + 4}`}
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon name={c.icon} className="size-[1.35rem]" />
                  </span>
                  <span className="font-display text-2xl text-muted-foreground/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-[1.7rem] tracking-tight">
                    {c.label}
                  </h3>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">
                    {count} generators
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    <span className="ulink">Open</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
