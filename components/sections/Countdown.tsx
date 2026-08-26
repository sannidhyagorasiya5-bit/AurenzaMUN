"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { SectionIntro } from "@/components/primitives/SectionIntro";
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
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setTime(getRemaining());
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
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

        <Reveal delay={0.15}>
          <div
            role="timer"
            aria-live="polite"
            aria-atomic="true"
            className="mt-10 flex flex-wrap gap-4 sm:flex-nowrap sm:gap-6"
          >
            {units.map((u) => (
              <div
                key={u.label}
                className="glass min-w-[6.5rem] flex-1 rounded-3xl px-4 py-6 text-center sm:px-6 sm:py-8"
              >
                <div className="relative h-[1em] overflow-hidden font-display text-4xl font-bold tabular-nums text-brand sm:text-6xl">
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
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {String(u.value).padStart(2, "0")}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
                  {u.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
