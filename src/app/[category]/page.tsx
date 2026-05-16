import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getCategories, getCategory, getGenerators } from "@/lib/data";
import { Icon } from "@/components/icon";

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.id }));
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

  return (
    <div className="space-y-16">
      <Link
        href="/"
        className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        <span className="ulink">All categories</span>
      </Link>

      <header className="reveal d1 flex items-start gap-6">
        <span className="mt-1.5 grid size-14 shrink-0 place-items-center rounded-full bg-accent text-primary">
          <Icon name={cat.icon} className="size-7" />
        </span>
        <div className="max-w-2xl space-y-4">
          <p className="kicker">Category</p>
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
          <h2 className="font-display text-2xl tracking-tight">Generators</h2>
          <span className="text-sm text-muted-foreground">
            {String(generators.length).padStart(2, "0")}
          </span>
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
    </div>
  );
}
