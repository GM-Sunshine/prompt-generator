"use client";

import { useMemo, useState } from "react";
import type { ResolvedGenerator } from "@/lib/schema";
import { renderTemplate } from "@/lib/template";
import { FieldControl } from "./field-control";
import { PromptOutput } from "./prompt-output";

type Value = string | string[] | boolean | undefined;
type State = Record<string, Value>;

function initialState(gen: ResolvedGenerator): State {
  const s: State = {};
  for (const f of gen.fields) {
    s[f.id] =
      f.default ??
      (f.type === "toggle" ? false : f.type === "multi-select" ? [] : "");
  }
  return s;
}

/** Map stored option ids to their human labels for the template context. */
function toContext(gen: ResolvedGenerator, state: State) {
  const ctx: Record<string, unknown> = {};
  for (const f of gen.fields) {
    const v = state[f.id];
    if (f.type === "select") {
      ctx[f.id] = f.options?.find((o) => o.id === v)?.label ?? "";
    } else if (f.type === "multi-select") {
      const ids = Array.isArray(v) ? v : [];
      ctx[f.id] = (f.options ?? [])
        .filter((o) => ids.includes(o.id))
        .map((o) => o.label);
    } else {
      ctx[f.id] = v;
    }
  }
  return ctx;
}

export function Builder({ generator }: { generator: ResolvedGenerator }) {
  const [state, setState] = useState<State>(() => initialState(generator));

  const set = (id: string, v: Value) =>
    setState((s) => ({ ...s, [id]: v }));

  const context = useMemo(
    () => toContext(generator, state),
    [generator, state],
  );

  const prompt = useMemo(
    () => renderTemplate(generator.template, context),
    [generator.template, context],
  );

  const missing = generator.fields
    .filter((f) => {
      if (!f.required) return false;
      const v = state[f.id];
      return Array.isArray(v) ? v.length === 0 : !v;
    })
    .map((f) => f.label);

  const titleField =
    generator.fields.find((f) =>
      [
        "projectName",
        "topic",
        "subject",
        "screen",
        "flowName",
        "product",
      ].includes(f.id),
    )?.id ?? generator.fields[0]?.id;
  const title = String(state[titleField] ?? generator.label);

  return (
    <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="space-y-8">
        <div className="flex items-baseline gap-3 border-b border-border pb-4">
          <span className="font-display text-xl text-primary">01</span>
          <h2 className="font-display text-xl tracking-tight">
            Shape your prompt
          </h2>
          <span className="ml-auto text-sm text-muted-foreground">
            {generator.fields.length} fields
          </span>
        </div>

        <div className="space-y-8">
          {generator.fields.map((f) => (
            <FieldControl
              key={f.id}
              field={f}
              value={state[f.id]}
              onChange={(v) => set(f.id, v)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-baseline gap-3 border-b border-border pb-4">
          <span className="font-display text-xl text-primary">02</span>
          <h2 className="font-display text-xl tracking-tight">Your prompt</h2>
          <span className="ml-auto text-sm text-muted-foreground">
            {prompt.length.toLocaleString()} characters
          </span>
        </div>

        <PromptOutput prompt={prompt} title={title} missing={missing} />
      </div>
    </div>
  );
}
