"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { committees, type Accent, type Committee, type Track } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { CommitteeModal } from "@/components/primitives/CommitteeModal";
import { GenerativeBackground } from "@/components/primitives/GenerativeBackground";
import { SectionIntro } from "@/components/primitives/SectionIntro";
import { TiltCard } from "@/components/primitives/TiltCard";
import { TrackTabs, type TabItem } from "@/components/primitives/TrackTabs";

const accentDot: Record<Accent, string> = {
  blue: "bg-blue",
  gold: "bg-brand",
  ice: "bg-ice",
};

const accentLink: Record<Accent, string> = {
  blue: "text-blue",
  gold: "text-brand",
  ice: "text-ice",
};

export function Committees() {
  const reduce = useReducedMotion();
  type TrackId = (typeof committees.tracks)[number]["id"];
  const [active, setActive] = useState<TrackId>(committees.tracks[0].id);
  const [open, setOpen] = useState<Committee | null>(null);

  const tabs: TabItem[] = committees.tracks.map((t) => ({
    id: t.id,
    label: t.tab,
    accent: t.accent,
  }));

  const track: Track = useMemo(
    () => committees.tracks.find((t) => t.id === active)!,
    [active],
  );

  return (
    <section
      id="committees"
      aria-labelledby="committees-heading"
      className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
    >
      <GenerativeBackground />

      <div className="mx-auto max-w-6xl">
        <div id="committees-heading">
          <SectionIntro
            eyebrow={committees.eyebrow}
            heading={committees.heading}
            description={committees.description}
            accent="blue"
          />
        </div>

        <p className="mt-4 max-w-2xl font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">
          {committees.note}
        </p>

        <div className="mt-10">
          <TrackTabs
            tabs={tabs}
            value={active}
            onChange={(id) => setActive(id as TrackId)}
            idBase="track"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={track.id}
            id={`track-panel-${track.id}`}
            role="tabpanel"
            aria-labelledby={`track-tab-${track.id}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-10"
          >
            {track.committees.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {track.committees.map((c, i) => (
                  <motion.div
                    key={c.abbr}
                    initial={reduce ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
                  >
                    <TiltCard
                      accent={track.accent}
                      className="relative flex h-full flex-col p-7"
                    >
                      {/* The whole panel opens the dialog; the button sits on
                          top so the card keeps its pointer tilt underneath. */}
                      <button
                        type="button"
                        onClick={() => setOpen(c)}
                        aria-label={`${c.abbr} — view agenda and portfolios`}
                        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-2"
                      />

                      <h3 className="font-display text-2xl font-bold uppercase leading-none tracking-tight">
                        {c.abbr}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">{c.name}</p>

                      <span
                        className={`mt-6 inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] ${accentLink[track.accent]}`}
                        aria-hidden
                      >
                        View details
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass flex flex-col items-center justify-center rounded-3xl border-dashed px-8 py-20 text-center">
                <span className={`h-2.5 w-2.5 rounded-full ${accentDot[track.accent]}`} />
                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
                  {track.emptyState}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open ? (
          <CommitteeModal
            key={open.abbr}
            committee={open}
            accent={track.accent}
            portfolioNote={committees.portfolioNote}
            onClose={() => setOpen(null)}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
