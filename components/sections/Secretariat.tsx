"use client";

import { secretariat } from "@/lib/content";
import { GenerativeBackground } from "@/components/primitives/GenerativeBackground";
import { Pill } from "@/components/primitives/Pill";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionIntro } from "@/components/primitives/SectionIntro";
import { TiltCard } from "@/components/primitives/TiltCard";

/* Seven rows of three, laid out whether or not the names exist yet. */
const PANELS = secretariat.panelRows * secretariat.panelsPerRow;

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("");

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

        {/* auto-rows-fr holds every row to the same height, so an announced
            panel and an empty one read as two states of one grid rather than
            as a filled section with filler stacked under it. */}
        <ul className="mt-14 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PANELS }, (_, i) => {
            /* Indexing past the tuple is the point here, so read it as
               optional rather than letting `as const` promise a member. */
            const m = i < secretariat.members.length ? secretariat.members[i] : undefined;

            return (
              <Reveal
                as="li"
                key={m ? m.name : `slot-${i}`}
                /* Stagger across a row, not across all twenty-one panels —
                   an index-wide delay would still be animating in the sixth
                   row long after the reader got there. */
                delay={(i % secretariat.panelsPerRow) * 0.08}
                className="list-none"
              >
                <TiltCard
                  accent="gold"
                  interactive={!!m}
                  className={`flex h-full flex-col p-7 ${m ? "" : "border-dashed"}`}
                >
                  {m ? (
                    <>
                      {/* generative photo placeholder */}
                      <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border-glass bg-gradient-to-br from-blue/25 via-transparent to-brand/20">
                        <span className="font-display text-3xl font-bold text-foreground/80">
                          {initials(m.name)}
                        </span>
                        <span className="absolute bottom-2 font-mono text-[0.55rem] uppercase tracking-[0.15em] text-muted">
                          Photo coming soon
                        </span>
                      </div>

                      <Pill accent="gold" variant="solid" className="mt-6 self-start">
                        {m.role}
                      </Pill>
                      <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">
                        {m.name}
                      </h3>
                      <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                        {m.subtitle}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-muted">{m.bio}</p>
                    </>
                  ) : (
                    <>
                      <div
                        aria-hidden
                        className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-dashed border-border-glass bg-surface"
                      >
                        <span className="h-2 w-2 rounded-full bg-brand/40" />
                      </div>

                      <Pill accent="gold" variant="dashed" className="mt-6 self-start">
                        To be announced
                      </Pill>
                    </>
                  )}
                </TiltCard>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {secretariat.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
