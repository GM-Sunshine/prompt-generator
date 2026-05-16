"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import {
  EXPORT_TARGETS,
  formatPrompt,
  type TargetId,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function PromptOutput({
  prompt,
  title,
  missing,
}: {
  prompt: string;
  title: string;
  missing: string[];
}) {
  const [target, setTarget] = useState<TargetId>("plain");
  const [copied, setCopied] = useState(false);

  const text = useMemo(
    () => formatPrompt(target, prompt, title),
    [target, prompt, title],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't access the clipboard");
    }
  }

  function download() {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(title || "prompt")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}.${target}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const activeDesc = EXPORT_TARGETS.find((t) => t.id === target)?.description;

  return (
    <div className="space-y-5 lg:sticky lg:top-28">
      {/* Export target — editorial underlined tabs */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-border">
        {EXPORT_TARGETS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTarget(t.id)}
            className={cn(
              "-mb-px border-b-2 pb-2.5 pt-1 text-sm transition-colors",
              target === t.id
                ? "border-primary font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{activeDesc}</p>

      {missing.length > 0 && (
        <p className="flex items-start gap-2 text-sm text-primary">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
          Still needed: {missing.join(", ")} — the preview updates as you type.
        </p>
      )}

      {/* The prompt, typeset */}
      <div className="card-soft relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-[3px] bg-primary" />

        <div className="flex items-center justify-between border-b border-border py-3 pl-7 pr-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Output
          </span>
          <span className="text-xs text-muted-foreground">
            {text.split("\n").length} lines · {text.length.toLocaleString()}{" "}
            chars
          </span>
        </div>

        <pre className="mono max-h-[56vh] overflow-auto whitespace-pre-wrap py-6 pl-7 pr-6 text-[13px] leading-[1.7] text-foreground/85">
          {text}
        </pre>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={download}
          className="group inline-flex items-center gap-1.5 px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Download className="size-4" />
          <span className="ulink">Download</span>
        </button>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]"
        >
          {copied ? (
            <Check className="size-4" />
          ) : (
            <Copy className="size-4" />
          )}
          {copied ? "Copied" : "Copy prompt"}
        </button>
      </div>
    </div>
  );
}
