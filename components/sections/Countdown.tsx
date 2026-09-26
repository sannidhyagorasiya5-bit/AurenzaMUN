"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE, alternateIn } from "@/lib/motion";
import { GenerativeBackground } from "@/components/primitives/GenerativeBackground";
import { LegacySectionIntro as SectionIntro } from "@/components/primitives/legacy/LegacySectionIntro";
import { Reveal } from "@/components/primitives/Reveal";

/** Opening gavel — 10th October 2026, 12:00 AM IST. */
const TARGET = new Date("2026-10-10T00:00:00+05:30").getTime();

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;

function getRemaining() {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / 1000),
    done: diff <= 0,
  };
}

/**
 * Live countdown to the opening gavel. Mirrors CountUp's SSR-safe pattern:
 * renders a neutral placeholder on first paint, then corrects on mount so
 * server/client never disagree on "now".
 */
export function Countdown() {
  const reduce = useReducedMotion();
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(
    null,
  );

  useEffect(() => {
    /* First reading lands after the first paint, not during the effect
       body, so correcting "now" never cascades a render out of hydration. */
    const first = requestAnimationFrame(() => setTime(getRemaining()));
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(id);
    };
  }, []);

  const done = time?.done ?? false;

  const units = [
    { label: "DAYS", value: time?.days ?? 0 },
    { label: "HOURS", value: time?.hours ?? 0 },
    { label: "MINUTES", value: time?.minutes ?? 0 },
    { label: "SECONDS", value: time?.seconds ?? 0 },
  ];

  return (
    <section
      id="countdown"
      aria-labelledby="countdown-heading"
      className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
    >
      <GenerativeBackground />

      <div className="mx-auto max-w-6xl">
        <div id="countdown-heading">
          <SectionIntro
            eyebrow={done ? "WE'RE LIVE" : "COUNTDOWN TO"}
            heading={["THE ULTIMATE", "COUNTDOWN"]}
            description={
              done
                ? "AurenzaMUN is officially underway — see you in committee."
                : "The gavel drops 10th October 2026, 12:00 AM IST at SVIS Kandivali, Mumbai."
            }
            accent="gold"
            accentClass="text-brand"
          />
        </div>

        {/* Styled after the stat panels under the hero: one bordered block,
            white numbers over mono labels, each cell drawing its own divider
            (four across from sm, two by two on a phone). The cells fade in
            alternately; the digits still roll as they change. */}
        <div
          role="timer"
          aria-live="polite"
          aria-atomic="true"
          className="mt-10 grid grid-cols-2 overflow-hidden rounded-surface border border-hairline sm:grid-cols-4"
        >
          {units.map((u, i) => {
            const digits = String(u.value).padStart(2, "0");
            return (
              <Reveal
                key={u.label}
                {...alternateIn(i)}
                className={`bg-background/60 ${i % 2 ? "border-l border-hairline" : ""} ${
                  i >= 2 ? "border-t border-hairline sm:border-t-0" : ""
                } ${i === 2 ? "sm:border-l" : ""}`}
              >
                <div className="flex h-full flex-col-reverse justify-end gap-2 px-4 py-6 sm:gap-3 sm:px-8 sm:py-12">
                  <p className="font-mono text-[0.6rem] uppercase leading-snug tracking-[0.14em] text-muted sm:text-[0.7rem] sm:tracking-[0.2em]">
                    {u.label}
                  </p>
                  <div className="relative overflow-hidden font-display text-[clamp(2.1rem,8vw,6.5rem)] font-black leading-none tracking-tight tabular-nums">
                    {/* Invisible copy holds the width; the rolling digit sits over it. */}
                    <span aria-hidden className="invisible">
                      {digits}
                    </span>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={u.value}
                        initial={reduce ? {} : { y: "-100%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={reduce ? {} : { y: "100%", opacity: 0 }}
                        transition={{
                          y: { duration: 0.4, ease: EASE },
                          opacity: { duration: 0.55, ease: EASE },
                        }}
                        className="absolute inset-0 flex items-center"
                      >
                        {digits}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
