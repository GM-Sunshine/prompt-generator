import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, GitPullRequest, FilePlus2, Check } from "lucide-react";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contribute — Prompt Generator",
  description:
    "Add a generator or category by editing JSON and opening a pull request. No build step, no code.",
};

const REPO = "https://github.com/GM-Sunshine/prompt-generator";
const NEW_GENERATOR_DIR = `${REPO}/new/main/data/generators`;
const EDIT_CATEGORIES = `${REPO}/edit/main/data/categories.json`;
const GENERATORS_DIR = `${REPO}/tree/main/data/generators`;

function Code({ children }: { children: string }) {
  return (
    <pre className="mono overflow-auto rounded-lg border border-border bg-card px-5 py-4 text-[12.5px] leading-relaxed text-foreground/85">
      {children}
    </pre>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-[3rem_1fr]">
      <span className="font-display text-3xl text-primary">{n}</span>
      <div className="space-y-3">
        <h3 className="font-display text-2xl tracking-tight">{title}</h3>
        <div className="space-y-3 text-[0.97rem] leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ContributePage() {
  const categories = getCategories();

  return (
    <div className="space-y-16">
      <header className="reveal d1 max-w-2xl space-y-4">
        <p className="kicker">Open contribution</p>
        <h1 className="font-display text-5xl tracking-tight sm:text-6xl">
          Add a generator
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Every generator on this site is plain JSON in the repo. Adding one is
          a pull request — no build step, no app code. A maintainer reviews and
          merges; the site is then redeployed manually (changes are not
          auto-deployed).
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={NEW_GENERATOR_DIR}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
          >
            <FilePlus2 className="size-4" />
            New generator file on GitHub
          </a>
          <a
            href={`${REPO}/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground"
          >
            <span className="ulink">Read CONTRIBUTING.md</span>
            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </header>

      <section className="reveal d2 space-y-12 border-t border-border pt-12">
        <Step n="01" title="Find the right file">
          <p>
            Generators live in{" "}
            <a
              href={GENERATORS_DIR}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              <code className="mono">data/generators/</code>
            </a>
            , one JSON file per category. To add to an existing category, edit
            its file (e.g. <code className="mono">development.json</code>). To
            add a whole new category, create a new{" "}
            <code className="mono">data/generators/&lt;id&gt;.json</code> and add
            an entry to{" "}
            <a
              href={EDIT_CATEGORIES}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              <code className="mono">data/categories.json</code>
            </a>
            .
          </p>
          <p>
            Current categories:{" "}
            {categories.map((c, i) => (
              <span key={c.id}>
                <code className="mono">{c.id}</code>
                {i < categories.length - 1 ? ", " : ""}
              </span>
            ))}
            .
          </p>
        </Step>

        <Step n="02" title="Append a generator object">
          <p>
            Each file is a JSON array. Add an object with this shape:
          </p>
          <Code>{`{
  "id": "kebab-case-id",
  "label": "Human Title",
  "description": "One line, what it produces",
  "icon": "Sparkles",            // any lucide-react icon name
  "fields": [
    { "id": "name", "label": "Name", "type": "text", "required": true },
    { "id": "tone", "label": "Tone", "type": "select",
      "options": [{ "id": "formal", "label": "Formal" },
                  { "id": "casual", "label": "Casual" }],
      "default": "formal" },
    { "id": "tests", "label": "Add tests", "type": "toggle", "default": true }
  ],
  "template": "You are an expert. Build {{name}} in a {{tone}} tone.{{#if tests}} Include tests.{{/if}}\\n\\n## Deliverables\\n1. ..."
}`}</Code>
          <p>
            Field types: <code className="mono">text</code>,{" "}
            <code className="mono">textarea</code>,{" "}
            <code className="mono">select</code>,{" "}
            <code className="mono">multi-select</code>,{" "}
            <code className="mono">toggle</code>. Options are inline, or pull
            from a shared pool in{" "}
            <code className="mono">data/options/</code> via{" "}
            <code className="mono">optionsRef</code>.
          </p>
        </Step>

        <Step n="03" title="Write the template">
          <p>
            The template is a string rendered by a tiny, safe engine (no{" "}
            <code className="mono">eval</code>). Supported syntax:
          </p>
          <Code>{`{{ name }}                       interpolate (arrays join with ", ")
{{#if x}} … {{else}} … {{/if}}   truthiness
{{#if x == "Label"}} … {{/if}}   equality (compare to a select's label)
{{#unless x}} … {{/unless}}
{{#each list}} {{this}} {{/each}} loop a multi-select`}</Code>
          <p>
            Quality bar: open with a clear expert role, restate the inputs via{" "}
            <code className="mono">{`{{fields}}`}</code>, gate sections with{" "}
            <code className="mono">{`{{#if}}`}</code>, and end with explicit
            deliverables. Every <code className="mono">{`{{var}}`}</code> must
            match a field <code className="mono">id</code>.
          </p>
        </Step>

        <Step n="04" title="Open a pull request">
          <p>
            Use the GitHub editor (the button above opens the “new file”
            screen, or use “Edit” on an existing file). GitHub will offer to
            fork the repo and{" "}
            <span className="font-medium text-foreground">
              “Propose changes”
            </span>{" "}
            — that creates the PR. In the description, note the category and
            what the generator is for.
          </p>
          <ul className="space-y-1.5">
            {[
              "JSON is valid (no trailing commas)",
              "Every template variable is a real field id",
              "Distinct from existing generators",
              "Ends with concrete deliverables",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <a
              href={`${REPO}/pulls`}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/40"
            >
              <GitPullRequest className="size-4 text-primary" />
              View open pull requests
            </a>
          </div>
        </Step>
      </section>

      <section className="reveal d3 rounded-xl border border-border bg-card p-7">
        <h2 className="font-display text-2xl tracking-tight">
          What happens after you submit
        </h2>
        <ol className="mt-4 space-y-2 text-[0.97rem] leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">1.</span> A maintainer
            reviews the PR for JSON validity and prompt quality.
          </li>
          <li>
            <span className="font-medium text-foreground">2.</span> Once merged,
            it ships on the next manual deploy (no auto-deploy — typically
            within a short window).
          </li>
          <li>
            <span className="font-medium text-foreground">3.</span> Your
            generator appears here and in{" "}
            <Link href="/browse" className="text-primary underline">
              Browse all
            </Link>
            , statically rendered like the rest.
          </li>
        </ol>
      </section>
    </div>
  );
}
