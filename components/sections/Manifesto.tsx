"use client";

import { hero } from "@/lib/content";
import { CountUp } from "@/components/primitives/CountUp";
import { Reveal } from "@/components/primitives/Reveal";
import { alternateIn } from "@/lib/motion";

/**
 * The three numbers behind the conference, counted up as they arrive. The
 * panels fade in alternately (up, down, up) and each draws its own divider,
 * so nothing behind them flashes through while they move.
 */
export function Manifesto() {
  return (
    <section
      aria-label="AurenzaMUN in numbers"
      className="relative px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <dl className="grid grid-cols-3 overflow-hidden rounded-surface border border-hairline">
          {hero.stats.map((s, i) => (
            <Reveal
              key={s.label}
              {...alternateIn(i)}
              className={`bg-background/60 ${i > 0 ? "border-l border-hairline" : ""}`}
            >
              <div className="flex h-full flex-col-reverse justify-end gap-2 px-3 py-6 sm:gap-3 sm:px-8 sm:py-14">
                <dt className="font-mono text-[0.6rem] uppercase leading-snug tracking-[0.14em] text-muted sm:text-[0.7rem] sm:tracking-[0.2em]">
                  {s.label}
                </dt>
                <dd className="font-display text-[clamp(2.1rem,8vw,6.5rem)] font-black leading-none tracking-tight tabular-nums">
                  <CountUp to={s.value} />
                  <span className="text-brand">
                    {"suffix" in s ? s.suffix : ""}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
