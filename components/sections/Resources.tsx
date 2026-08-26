"use client";

import { resources } from "@/lib/content";
import { Pill } from "@/components/primitives/Pill";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionIntro } from "@/components/primitives/SectionIntro";
import { TiltCard } from "@/components/primitives/TiltCard";

export function Resources() {
  return (
    <section
      id="resources"
      aria-labelledby="resources-heading"
      className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div id="resources-heading">
          <SectionIntro
            eyebrow={resources.eyebrow}
            heading={resources.heading}
            description={resources.description}
            accent="blue"
            accentClass="text-brand"
          >
            <Reveal delay={0.15}>
              <div className="mt-6">
                <Pill accent="blue" variant="dashed">
                  {resources.statusBadge}
                </Pill>
              </div>
            </Reveal>
          </SectionIntro>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {resources.cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.07}>
              <TiltCard accent="blue" className="flex h-full flex-col p-7">
                <div className="flex items-center justify-between gap-4">
                  <Pill accent="blue" variant="outline">
                    {card.tag}
                  </Pill>
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
                    {card.state}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{card.description}</p>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-blue/40 to-transparent" />
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 text-center text-sm text-muted">{resources.closing}</p>
        </Reveal>
      </div>
    </section>
  );
}
