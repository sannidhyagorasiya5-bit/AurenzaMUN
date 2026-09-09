"use client";

import { secretariat } from "@/lib/content";
import { GenerativeBackground } from "@/components/primitives/GenerativeBackground";
import { Pill } from "@/components/primitives/Pill";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionIntro } from "@/components/primitives/SectionIntro";
import { TiltCard } from "@/components/primitives/TiltCard";

export function Secretariat() {
  return (
    <section
      id="crew"
      aria-labelledby="crew-heading"
      className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
    >
      <GenerativeBackground />

      <div className="mx-auto max-w-6xl">
        <div id="crew-heading">
          <SectionIntro
            eyebrow={secretariat.eyebrow}
            heading={secretariat.heading}
            description={secretariat.description}
            accent="blue"
            accentClass="text-brand"
          />
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {secretariat.members.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.1}>
              <TiltCard accent="gold" className="flex h-full flex-col gap-6 p-7 sm:flex-row">
                {/* generative photo placeholder */}
                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border-glass bg-gradient-to-br from-blue/25 via-transparent to-brand/20">
                  <span className="font-display text-3xl font-bold text-foreground/80">
                    {m.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <span className="absolute bottom-2 font-mono text-[0.55rem] uppercase tracking-[0.15em] text-muted">
                    Photo coming soon
                  </span>
                </div>

                <div className="flex flex-col">
                  <Pill accent="gold" variant="solid" className="self-start">
                    {m.role}
                  </Pill>
                  <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">{m.name}</h3>
                  <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                    {m.subtitle}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{m.bio}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {secretariat.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
