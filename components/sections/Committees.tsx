"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { committees, type Accent, type Track } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { GenerativeBackground } from "@/components/primitives/GenerativeBackground";
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
  const [flipped, setFlipped] = useState<Set<string>>(() => new Set());

  function toggleFlip(abbr: string) {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(abbr)) next.delete(abbr);
      else next.add(abbr);
      return next;
    });
  }

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
                {track.committees.map((c, i) => {
                  const isFlipped = flipped.has(c.abbr);
                  return (
                    <motion.div
                      key={c.abbr}
                      initial={reduce ? {} : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
                      className="h-full"
                      style={{ perspective: 1200 }}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        aria-pressed={isFlipped}
                        aria-label={`${c.abbr}, ${isFlipped ? "showing agenda status, press to flip back" : "press to reveal agenda status"}`}
                        onClick={() => toggleFlip(c.abbr)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleFlip(c.abbr);
                          }
                        }}
                        className="relative h-full cursor-pointer rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        <motion.div
                          className="relative h-full"
                          style={{
                            transformStyle: "preserve-3d",
                            WebkitTransformStyle: "preserve-3d",
                          }}
                          animate={{ rotateY: isFlipped ? 180 : 0 }}
                          transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
                        >
                          <div
                            aria-hidden={isFlipped}
                            style={{
                              backfaceVisibility: "hidden",
                              WebkitBackfaceVisibility: "hidden",
                            }}
                            className={isFlipped ? "pointer-events-none" : ""}
                          >
                            <TiltCard
                              accent={track.accent}
                              interactive={!isFlipped}
                              className="h-full p-7"
                            >
                              <span
                                className={`font-mono text-[0.7rem] uppercase tracking-[0.2em] ${accentText[track.accent]}`}
                              >
                                {c.agenda}
                              </span>
                              <h3 className="mt-4 font-display text-2xl font-bold uppercase leading-none tracking-tight">
                                {c.abbr}
                              </h3>
                              <p className="mt-3 text-sm leading-relaxed text-muted">
                                {c.name}
                              </p>
                            </TiltCard>
                          </div>
                          <div
                            aria-hidden={!isFlipped}
                            style={{
                              backfaceVisibility: "hidden",
                              WebkitBackfaceVisibility: "hidden",
                              transform: "rotateY(180deg)",
                            }}
                            className={`absolute inset-0 ${!isFlipped ? "pointer-events-none" : ""}`}
                          >
                            <div className="glass flex h-full flex-col items-center justify-center rounded-3xl p-7 text-center">
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${accentDot[track.accent]}`}
                              />
                              <p className="mt-4 text-sm leading-relaxed text-muted">
                                Agenda will be announced soon
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
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
