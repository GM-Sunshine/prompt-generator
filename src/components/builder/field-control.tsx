"use client";

import type { ResolvedField } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Value = string | string[] | boolean | undefined;

function groupOptions(field: ResolvedField) {
  const groups = new Map<string, { id: string; label: string }[]>();
  for (const o of field.options ?? []) {
    const key = o.group ?? "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(o);
  }
  return [...groups.entries()];
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-all duration-200",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {active && <Check className="size-3.5" />}
      {children}
    </button>
  );
}

const inputCls =
  "rounded-lg border-border bg-card text-[0.95rem] shadow-sm placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-primary/25";

function GroupRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function FieldControl({
  field,
  value,
  onChange,
}: {
  field: ResolvedField;
  value: Value;
  onChange: (v: Value) => void;
}) {
  const id = `f-${field.id}`;

  if (field.type === "toggle") {
    return (
      <label
        htmlFor={id}
        className="card-soft is-interactive flex cursor-pointer items-center justify-between gap-4 px-5 py-4"
      >
        <span className="text-[0.95rem] font-medium">{field.label}</span>
        <Switch
          id={id}
          checked={Boolean(value)}
          onCheckedChange={(c) => onChange(c)}
        />
      </label>
    );
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor={id}
        className="flex items-baseline gap-2 text-[0.95rem] font-medium"
      >
        {field.label}
        {field.required && (
          <span className="text-xs font-normal text-primary">required</span>
        )}
      </label>

      {field.type === "text" && (
        <Input
          id={id}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          className={inputCls}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "textarea" && (
        <Textarea
          id={id}
          rows={3}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          className={inputCls}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "select" &&
        groupOptions(field).map(([group, opts]) => (
          <div key={group} className="space-y-2.5">
            {group && <GroupRule label={group} />}
            <div className="flex flex-wrap gap-2">
              {opts.map((o) => (
                <Chip
                  key={o.id}
                  active={value === o.id}
                  onClick={() => onChange(o.id)}
                >
                  {o.label}
                </Chip>
              ))}
            </div>
          </div>
        ))}

      {field.type === "multi-select" &&
        groupOptions(field).map(([group, opts]) => (
          <div key={group} className="space-y-2.5">
            {group && <GroupRule label={group} />}
            <div className="flex flex-wrap gap-2">
              {opts.map((o) => {
                const arr = Array.isArray(value) ? value : [];
                const active = arr.includes(o.id);
                return (
                  <Chip
                    key={o.id}
                    active={active}
                    onClick={() =>
                      onChange(
                        active
                          ? arr.filter((x) => x !== o.id)
                          : [...arr, o.id],
                      )
                    }
                  >
                    {o.label}
                  </Chip>
                );
              })}
            </div>
          </div>
        ))}

      {field.help && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {field.help}
        </p>
      )}
    </div>
  );
}
