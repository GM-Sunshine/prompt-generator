import type { Metadata } from "next";
import Link from "next/link";
import { Newsreader, Hanken_Grotesk, Geist_Mono } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { LogoMark } from "@/components/logo";
import { getCategoryGroups } from "@/lib/data";
import "./globals.css";

const display = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const REPO = "https://github.com/GM-Sunshine/prompt-generator";

const SITE_URL = "https://prompt-generator.gm-sunshine.com";
const TITLE = "Prompt Generator — write better prompts, faster";
const DESCRIPTION =
  "An open-source, JSON-driven AI prompt generator. 270 guided generators across 27 categories. Build a polished prompt for ChatGPT, Cursor and more — no accounts, no API keys.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s",
  },
  description: DESCRIPTION,
  applicationName: "Prompt Generator",
  keywords: [
    "AI prompt generator",
    "prompt engineering",
    "ChatGPT prompts",
    "open source",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Prompt Generator",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const NAV = [
  { href: "/browse", label: "Browse all" },
  { href: "/contribute", label: "Contribute" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const groups = getCategoryGroups();

  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <div className="stage" />

        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
            <Link href="/" className="group flex items-center gap-2.5">
              <LogoMark className="size-7 transition-transform group-hover:-rotate-6" />
              <span className="flex items-baseline gap-1.5">
                <span className="font-display text-[1.55rem] font-semibold tracking-tight">
                  Prompt
                </span>
                <span className="font-display text-[1.55rem] font-semibold italic tracking-tight text-primary">
                  Generator
                </span>
              </span>
            </Link>

            <nav className="flex items-center gap-7 text-sm">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="hidden font-medium text-foreground sm:inline"
                >
                  <span className="ulink">{n.label}</span>
                </Link>
              ))}
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1 font-medium text-foreground"
              >
                <span className="ulink">Source</span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:py-20">
          {children}
        </main>

        <footer className="mt-10 border-t border-border/70">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-3 lg:col-span-1">
                <Link href="/" className="flex items-center gap-2">
                  <LogoMark className="size-6" />
                  <span className="flex items-baseline gap-1.5">
                    <span className="font-display text-xl font-semibold">
                      Prompt
                    </span>
                    <span className="font-display text-xl font-semibold italic text-primary">
                      Generator
                    </span>
                  </span>
                </Link>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Open-source, JSON-driven prompt studio. No accounts, no API
                  keys.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm">
                  <Link href="/browse" className="text-muted-foreground hover:text-foreground">
                    Browse all
                  </Link>
                  <Link href="/contribute" className="text-muted-foreground hover:text-foreground">
                    Contribute
                  </Link>
                  <a
                    href={REPO}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    GitHub
                  </a>
                </div>
              </div>

              {groups.map((g) => (
                <div key={g.group} className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {g.group}
                  </h3>
                  <ul className="space-y-1.5">
                    {g.categories.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/${c.id}`}
                          className="text-sm text-foreground/80 transition-colors hover:text-primary"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-1.5 border-t border-border/70 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                A project by{" "}
                <a
                  href="https://gm-sunshine.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-foreground transition-colors hover:text-primary"
                >
                  GM-Sunshine
                </a>{" "}
                · built with Next.js
              </span>
              <span>MIT licensed · contributions welcome</span>
            </div>
          </div>
        </footer>

        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
