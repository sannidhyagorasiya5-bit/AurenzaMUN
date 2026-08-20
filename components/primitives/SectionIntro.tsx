import type { Accent } from "@/lib/content";
import { AnimatedHeading } from "@/components/primitives/AnimatedHeading";
import { Pill } from "@/components/primitives/Pill";
import { Reveal } from "@/components/primitives/Reveal";

/**
 * Shared section header: eyebrow pill + two-line kinetic heading + description.
 * Keeps every section's intro consistent and DRY.
 */
export function SectionIntro({
  eyebrow,
  heading,
  description,
  accent = "blue",
  accentClass = "text-brand",
  align = "left",
  children,
}: {
  eyebrow: string;
  heading: [string, string];
  description: string;
  accent?: Accent;
  accentClass?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
}) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex max-w-2xl flex-col ${alignment} ${align === "center" ? "mx-auto" : ""}`}>
      <Reveal>
        <Pill accent={accent} dot>
          {eyebrow}
        </Pill>
      </Reveal>
      <AnimatedHeading
        lines={heading}
        accentLine={1}
        accentClass={accentClass}
        className="mt-5 font-display text-[clamp(2.25rem,6vw,4rem)] font-bold uppercase leading-[0.95] tracking-tight"
      />
      <Reveal delay={0.1}>
        <p className="mt-5 text-base leading-relaxed text-muted">{description}</p>
      </Reveal>
      {children}
    </div>
  );
}
