import type { ReactNode } from "react";
import type { Accent } from "@/lib/content";

type PillVariant = "solid" | "outline" | "dashed";

const accentText: Record<Accent, string> = {
  blue: "text-blue-deep",
  gold: "text-brand",
  ice: "text-ice-deep",
};

const accentBorder: Record<Accent, string> = {
  blue: "border-blue/40",
  gold: "border-brand/40",
  ice: "border-ice/40",
};

const accentDot: Record<Accent, string> = {
  blue: "bg-blue",
  gold: "bg-brand",
  ice: "bg-ice",
};

export function Pill({
  children,
  accent = "blue",
  variant = "outline",
  dot = false,
  className = "",
}: {
  children: ReactNode;
  accent?: Accent;
  variant?: PillVariant;
  dot?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] leading-none";

  const variants: Record<PillVariant, string> = {
    solid: `bg-surface-strong ${accentText[accent]} border border-transparent`,
    outline: `glass ${accentBorder[accent]} ${accentText[accent]}`,
    dashed: `border border-dashed ${accentBorder[accent]} text-muted`,
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {dot ? (
        <span className={`h-1.5 w-1.5 rounded-full ${accentDot[accent]}`} aria-hidden />
      ) : null}
      {children}
    </span>
  );
}
