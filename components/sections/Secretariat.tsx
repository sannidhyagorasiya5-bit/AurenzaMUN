"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { secretariat } from "@/lib/content";
import { GenerativeBackground } from "@/components/primitives/GenerativeBackground";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionIntro } from "@/components/primitives/SectionIntro";
import { DURATION, EASE } from "@/lib/motion";

const roster = secretariat.roster;

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("");

/** "Ruqaiyah Bharmal" -> ["Ruqaiyah", "Bharmal"]; the surname takes the accent. */
const splitName = (name: string): [string, string] => {
  const i = name.indexOf(" ");
  return i === -1 ? [name, ""] : [name.slice(0, i), name.slice(i + 1)];
};

const pad = (n: number) => String(n + 1).padStart(2, "0");

/** The two generals head the roster; everyone after them is a department head. */
const HEADS_START = 2;
const tierOf = (i: number) => (i < HEADS_START ? "SECRETARIAT" : "ORGANISING TEAM");

/** Stands in for the reference's "men / women / collections" nav row. */
const tiers = [
  { label: "Secretariat", at: 0 },
  { label: "Organising Team", at: HEADS_START },
] as const;

export function Secretariat() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const member = roster[active];
  const [firstName, lastName] = splitName(member.name);

  const step = useCallback((delta: number) => {
    setActive((i) => (i + delta + roster.length) % roster.length);
  }, []);

  /* Everyone except the featured member, in rail order starting from the one
     after them, so paging forward walks the strip left to right. */
  const upcoming = Array.from(
    { length: roster.length - 1 },
    (_, k) => (active + 1 + k) % roster.length,
  );

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

        <Reveal delay={0.1}>
          <div className="relative mt-14 overflow-hidden rounded-[1.75rem] border border-border-glass bg-[#0d0f17] shadow-2xl shadow-black/60 sm:rounded-[2rem]">
            {/* ---------- backdrop ---------- */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {/* Ghosted wordmark, the way the reference sits its logotype
                  behind the product. */}
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[clamp(5rem,20vw,15rem)] font-bold uppercase leading-none tracking-tighter text-white/[0.045]">
                {secretariat.watermark}
              </span>

              {/* Colour sweep out of the bottom-left corner — the reference
                  leans on one saturated shape here, so this stays vivid
                  rather than fading into the panel. */}
              <div className="absolute -bottom-56 -left-44 h-[32rem] w-[36rem] -rotate-12 rounded-full bg-[radial-gradient(ellipse_at_40%_55%,rgba(231,194,90,0.9),rgba(231,194,90,0.35)_38%,rgba(76,141,255,0.6)_62%,transparent_80%)] blur-2xl" />
              <div className="absolute -bottom-32 left-24 h-64 w-[24rem] rotate-[18deg] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(76,141,255,0.55),transparent_70%)] blur-2xl" />

              {/* Hairlines raking across the product, as a close pair. */}
              <div className="absolute left-[52%] top-[-25%] h-[150%] w-px rotate-[38deg] bg-gradient-to-b from-transparent via-brand/80 to-transparent" />
              <div className="absolute left-[55%] top-[-25%] h-[150%] w-px rotate-[38deg] bg-gradient-to-b from-transparent via-brand/35 to-transparent" />
            </div>

            {/* ---------- panel bar ---------- */}
            <div className="relative flex items-center justify-between gap-4 border-b border-white/5 px-6 py-5 sm:px-9">
              <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-brand">
                Aurenza<span className="text-foreground">MUN</span>
              </span>
              <nav aria-label="Jump to a group" className="hidden items-center gap-8 md:flex">
                {tiers.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setActive(t.at)}
                    aria-current={tierOf(active) === t.label.toUpperCase()}
                    className={`font-mono text-[0.65rem] uppercase tracking-[0.16em] transition-colors duration-200 ${
                      tierOf(active) === t.label.toUpperCase()
                        ? "text-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </nav>

              <div className="flex items-center gap-4">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted md:hidden">
                  {tierOf(active)}
                </span>
                <span aria-hidden="true" className="grid grid-cols-2 gap-1">
                  {Array.from({ length: 4 }, (_, i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-[1px] bg-brand" />
                  ))}
                </span>
              </div>
            </div>

            {/* ---------- body ---------- */}
            <div className="relative grid gap-10 px-6 pb-12 pt-10 sm:px-9 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-4 lg:pb-16">
              {/* ---- left: the featured member ---- */}
              <div className="relative z-10 flex flex-col">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={member.name}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -14 }}
                    transition={{ duration: DURATION.fast, ease: EASE }}
                  >
                    <h3 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-tight">
                      {firstName} <span className="text-brand">{lastName}</span>
                    </h3>
                    <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                      {member.role}
                    </p>

                    <p className="mt-6 font-display text-4xl font-bold tracking-tight">
                      {pad(active)}
                      <span className="ml-1 align-top font-mono text-xs tracking-[0.16em] text-muted">
                        / {pad(roster.length - 1)}
                      </span>
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* The swatch row from the reference, repurposed as the roster
                    selector. This is the control that survives on a phone. */}
                <div className="mt-8">
                  <p
                    id="crew-selector-label"
                    className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted"
                  >
                    Team:
                  </p>
                  <div
                    role="group"
                    aria-labelledby="crew-selector-label"
                    className="mt-3 flex flex-wrap gap-2.5"
                  >
                    {roster.map((m, i) => (
                      <button
                        key={m.name}
                        type="button"
                        onClick={() => setActive(i)}
                        aria-label={`${m.name} - ${m.role}`}
                        aria-current={i === active}
                        className={`h-3.5 w-3.5 rounded-full border transition-colors duration-200 ${
                          i === active
                            ? "border-brand bg-brand"
                            : "border-white/25 bg-white/10 hover:border-brand/60 hover:bg-brand/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Prev / next, after the split pill in the reference. */}
                <div className="mt-8 flex items-stretch self-start overflow-hidden rounded-md">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous team member"
                    className="bg-foreground/10 px-5 py-2.5 text-sm leading-none text-foreground transition-colors duration-200 hover:bg-foreground/20"
                  >
                    &#8249;
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next team member"
                    className="bg-brand px-5 py-2.5 text-sm leading-none text-brand-fg transition-colors duration-200 hover:bg-brand/85"
                  >
                    &#8250;
                  </button>
                </div>
              </div>

              {/* ---- right: the stage ---- */}
              <div className="relative h-72 sm:h-80 lg:h-[26rem]">
                {/* Featured portrait, canted like the hero product. */}
                <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 lg:left-[34%] lg:top-[42%]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={member.name}
                      initial={reduce ? false : { opacity: 0, x: 40, rotate: -4 }}
                      animate={{ opacity: 1, x: 0, rotate: -12 }}
                      exit={reduce ? undefined : { opacity: 0, x: -40, rotate: -20 }}
                      transition={{ duration: DURATION.base, ease: EASE }}
                      className="relative flex h-44 w-44 items-center justify-center rounded-[1.5rem] border border-brand/60 bg-gradient-to-br from-brand/45 via-blue/25 to-blue/50 shadow-[0_25px_70px_-15px_rgba(231,194,90,0.55)] sm:h-52 sm:w-52 lg:h-60 lg:w-60"
                    >
                      <span className="font-display text-5xl font-bold text-foreground lg:text-6xl">
                        {initials(member.name)}
                      </span>
                      <span className="absolute bottom-4 font-mono text-[0.5rem] uppercase tracking-[0.16em] text-foreground/60">
                        Photo coming soon
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Skewed filmstrip running up to the right. Rotating about its
                    own bottom-left corner keeps the far end inside the panel
                    however many tiles it holds. */}
                <div className="absolute bottom-1 left-[38%] z-10 hidden origin-bottom-left rotate-[-38deg] gap-3 lg:flex">
                  {upcoming.slice(0, 4).map((i) => (
                    <button
                      key={roster[i].name}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`${roster[i].name} - ${roster[i].role}`}
                      className="h-14 w-20 -skew-x-12 border border-white/15 bg-white/[0.07] transition-colors duration-200 hover:border-brand/60 hover:bg-brand/20"
                    >
                      <span className="flex h-full w-full skew-x-12 items-center justify-center font-display text-sm font-bold text-foreground/75">
                        {initials(roster[i].name)}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Arc rail. Ornament only: the dots above are the real control,
                    so this stays out of the tab order and the a11y tree. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block"
                >
                  <div className="flex flex-col items-center gap-6">
                    {upcoming.slice(4, 7).map((i) => (
                      <span
                        key={roster[i].name}
                        className="flex h-10 w-14 -rotate-12 items-center justify-center rounded-md border border-white/10 bg-white/[0.05] font-display text-[0.7rem] font-bold text-foreground/60"
                      >
                        {initials(roster[i].name)}
                      </span>
                    ))}
                  </div>
                  <span className="absolute -right-28 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border border-white/15" />
                  <span className="absolute -right-[6.6rem] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-foreground/70" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
