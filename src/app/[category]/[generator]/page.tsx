import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getAllGeneratorParams,
  getCategory,
  getGenerator,
} from "@/lib/data";
import { Icon } from "@/components/icon";
import { Builder } from "@/components/builder/builder";

export function generateStaticParams() {
  return getAllGeneratorParams();
}

export default async function GeneratorPage({
  params,
}: {
  params: Promise<{ category: string; generator: string }>;
}) {
  const { category, generator } = await params;
  const cat = getCategory(category);
  const gen = getGenerator(category, generator);
  if (!cat || !gen) notFound();

  return (
    <div className="space-y-14">
      <Link
        href={`/${category}`}
        className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        <span className="ulink">{cat.label}</span>
      </Link>

      <header className="reveal d1 flex items-start gap-6 border-b border-border pb-10">
        <span className="mt-1.5 grid size-14 shrink-0 place-items-center rounded-full bg-accent text-primary">
          <Icon name={gen.icon} className="size-7" />
        </span>
        <div className="max-w-2xl space-y-3">
          <p className="kicker">{cat.label}</p>
          <h1 className="font-display text-[2.7rem] leading-tight tracking-tight sm:text-5xl">
            {gen.label}
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {gen.description}
          </p>
        </div>
      </header>

      <div className="reveal d2">
        <Builder generator={gen} />
      </div>
    </div>
  );
}
