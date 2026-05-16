import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Schibsted_Grotesk, Geist_Mono } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  variable: "--font-display",
});
const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Prompt Forge — write better prompts, faster",
  description:
    "An open-source, JSON-driven AI prompt generator. Pick a category, choose a generator type, fill in guided parameters, and get a polished prompt for ChatGPT, Cursor and more.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <div className="stage" />

        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-[72px] max-w-5xl items-center justify-between px-6">
            <Link href="/" className="group flex items-baseline gap-2">
              <span className="font-display text-[1.6rem] font-semibold tracking-tight">
                Prompt
              </span>
              <span className="font-display text-[1.6rem] font-semibold italic tracking-tight text-primary">
                Forge
              </span>
            </Link>

            <div className="flex items-center gap-8 text-sm">
              <span className="hidden text-muted-foreground sm:inline">
                No API keys · runs on JSON
              </span>
              <a
                href="https://github.com/GM-Sunshine/prompt-generator"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1 font-medium text-foreground"
              >
                <span className="ulink">Source</span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-20">
          {children}
        </main>

        <footer className="border-t border-border/70">
          <div className="mx-auto flex max-w-5xl flex-col gap-1.5 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Prompt Forge — an open-source prompt studio. Built with Next.js.
            </span>
            <span>MIT licensed</span>
          </div>
        </footer>

        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
