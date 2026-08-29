import type { ReactNode } from "react";
import type { Accent } from "@/lib/content";

type PillVariant = "solid" | "outline" | "dashed";

/* Blue/ice pills are light chips carrying midnight-blue text, which is the
   only way that navy stays legible on this near-black page. Gold keeps the
   glass treatment — it is already high-contrast on the dark background. */
const accentSolid: Record<Accent, string> = {
  blue: "bg-blue-chip text-blue-deep",
  gold: "bg-surface-strong text-brand",
  ice: "bg-ice-chip text-ice-deep",
};

const accentOutline: Record<Accent, string> = {
  blue: "bg-blue-chip text-blue-deep border-blue-chip",
  gold: "glass text-brand border-brand/40",
  ice: "bg-ice-chip text-ice-deep border-ice-chip",
};

const accentBorder: Record<Accent, string> = {
  blue: "border-blue/40",
  gold: "border-brand/40",
  ice: "border-ice/40",
};

/* Dots sit on the chip, so they take the same midnight tone as the label. */
const accentDot: Record<Accent, string> = {
  blue: "bg-blue-deep",
  gold: "bg-brand",
  ice: "bg-ice-deep",
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
    solid: `${accentSolid[accent]} border border-transparent`,
    outline: `border ${accentOutline[accent]}`,
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
