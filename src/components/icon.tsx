import { icons, type LucideProps } from "lucide-react";

/** Renders a lucide icon by its string name (icons come from JSON data). */
export function Icon({
  name,
  ...props
}: { name?: string } & LucideProps) {
  const Cmp = name
    ? (icons as Record<string, React.ComponentType<LucideProps>>)[name]
    : undefined;
  const Fallback = icons.Sparkles;
  const C = Cmp ?? Fallback;
  return <C {...props} />;
}
