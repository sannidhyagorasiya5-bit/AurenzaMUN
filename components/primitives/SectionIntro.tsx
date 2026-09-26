import type { ReactNode } from "react";
import { AnimatedHeading } from "@/components/primitives/AnimatedHeading";
import { Pill } from "@/components/primitives/Pill";
import { Reveal } from "@/components/primitives/Reveal";

/**
 * Section header: heading stacked over its description. The eyebrow is
 * optional and rationed; most sections carry none, the heading is enough.
 * `id` lands on the heading so the section's aria-labelledby resolves to it.
 */
export function SectionIntro({
  id,
  eyebrow,
  heading,
  description,
  align = "left",
  size = "lg",
  children,
}: {
  id: string;
  eyebrow?: string;
  heading: [string, string];
  description?: string;
  align?: "left" | "center";
  size?: "lg" | "xl";
  children?: ReactNode;
}) {
  const center = align === "center";
  return (
    <div className={`flex flex-col ${center ? "mx-auto items-center text-center" : "items-start"}`}>
      {eyebrow ? (
        <Reveal>
          <Pill>{eyebrow}</Pill>
        </Reveal>
      ) : null}
      <AnimatedHeading
        id={id}
        lines={heading}
        accentLine={1}
        className={`${eyebrow ? "mt-6" : ""} font-display font-extrabold uppercase leading-[0.9] tracking-tight ${
          size === "xl"
            ? "text-[clamp(2.75rem,9vw,8.5rem)]"
            : "text-[clamp(2.4rem,6.4vw,5.75rem)]"
        }`}
      />
      {description ? (
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted sm:text-lg">
            {description}
          </p>
        </Reveal>
      ) : null}
      {children}
    </div>
  );
}
