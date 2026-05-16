export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Prompt Generator"
    >
      <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
      <path
        d="M10.5 9.5 L17 16 L10.5 22.5"
        fill="none"
        stroke="var(--color-primary-foreground)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="17.6"
        y="20.1"
        width="7.4"
        height="2.8"
        rx="1.4"
        fill="var(--color-primary-foreground)"
      />
    </svg>
  );
}
