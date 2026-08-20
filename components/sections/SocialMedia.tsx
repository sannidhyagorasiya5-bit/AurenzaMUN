"use client";

import type { ReactNode } from "react";
import { social } from "@/lib/content";
import type { Accent } from "@/lib/content";
import { GenerativeBackground } from "@/components/primitives/GenerativeBackground";
import { Pill } from "@/components/primitives/Pill";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionIntro } from "@/components/primitives/SectionIntro";
import { TiltCard } from "@/components/primitives/TiltCard";

const accents: Accent[] = ["gold", "blue", "ice"];

const iconText: Record<Accent, string> = {
  gold: "text-brand",
  blue: "text-blue",
  ice: "text-ice",
};

const icons: Record<string, ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
  "Mail Us": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  ),
};

export function SocialMedia() {
  return (
    <section
      id="social"
      aria-labelledby="social-heading"
      className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
    >
      <GenerativeBackground />

      <div className="mx-auto max-w-6xl">
        <div id="social-heading">
          <SectionIntro
            eyebrow={social.eyebrow}
            heading={social.heading}
            description={social.description}
            accent="blue"
            accentClass="text-brand"
          />
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {social.platforms.map((p, i) => {
            const accent = accents[i % accents.length];
            return (
              <Reveal key={p.name} delay={i * 0.1}>
                <TiltCard
                  accent={accent}
                  className="relative flex h-full items-center gap-6 p-7"
                >
                  <a
                    href={p.href}
                    {...(p.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={p.external ? `AurenzaMUN on ${p.name}` : `Email AurenzaMUN at ${p.handle}`}
                    className="absolute inset-0 rounded-3xl focus-visible:outline-2"
                  />
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border-glass bg-gradient-to-br from-blue/25 via-transparent to-brand/20 ${iconText[accent]}`}
                  >
                    {icons[p.name]}
                  </div>

                  <div className="flex min-w-0 flex-col">
                    <Pill accent={accent} variant="outline" className="self-start">
                      {p.name}
                    </Pill>
                    <p className="mt-3 break-words font-display text-xl font-bold tracking-tight">
                      {p.handle}
                    </p>
                    <span className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                      {p.cta}
                    </span>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
