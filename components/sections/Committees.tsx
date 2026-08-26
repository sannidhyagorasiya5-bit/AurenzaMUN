"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { committees, type Accent, type Track } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { SectionIntro } from "@/components/primitives/SectionIntro";
import { TiltCard } from "@/components/primitives/TiltCard";
import { TrackTabs, type TabItem } from "@/components/primitives/TrackTabs";

const accentText: Record<Accent, string> = {
  blue: "text-blue",
  gold: "text-brand",
  ice: "text-ice",
};

const accentDot: Record<Accent, string> = {
  blue: "bg-blue",
  gold: "bg-brand",
  ice: "bg-ice",
};

export function Committees() {
  const reduce = useReducedMotion();
  type TrackId = (typeof committees.tracks)[number]["id"];
  const [active, setActive] = useState<TrackId>(committees.tracks[0].id);

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
      <div className="mx-auto max-w-6xl">
        <div id="committees-heading">
          <SectionIntro
            eyebrow={committees.eyebrow}
            heading={committees.heading}
            description={committees.description}
            accent="blue"
          />
        </div>

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
                    <TiltCard accent={track.accent} className="h-full p-7">
                      <span
                        className={`font-mono text-[0.7rem] uppercase tracking-[0.2em] ${accentText[track.accent]}`}
                      >
                        {c.agenda}
                      </span>
                      <h3 className="mt-4 font-display text-2xl font-bold uppercase leading-none tracking-tight">
                        {c.abbr}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">{c.name}</p>
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
    </section>
  );
}
