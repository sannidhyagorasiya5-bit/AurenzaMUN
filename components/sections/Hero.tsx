"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { hero } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { AnimatedHeading } from "@/components/primitives/AnimatedHeading";
import { CountUp } from "@/components/primitives/CountUp";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { Pill } from "@/components/primitives/Pill";

export function Hero() {
  const reduce = useReducedMotion();

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    <section
      id="top"
      aria-label="AurenzaMUN introduction"
      className="relative flex min-h-screen items-center overflow-hidden px-5 pt-28 pb-16 sm:px-8"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        {/* left: copy */}
        <div>
          <motion.div className="flex flex-wrap gap-3" {...fade(0.1)}>
            <Pill accent="gold" dot>
              {hero.badges[0]}
            </Pill>
            <a
              href={hero.venueMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${hero.badges[1]} — open in Google Maps`}
              className="transition-opacity hover:opacity-80"
            >
              <Pill accent="blue" dot className="cursor-pointer underline decoration-blue/40 underline-offset-4 hover:decoration-blue">
                {hero.badges[1]}
              </Pill>
            </a>
          </motion.div>

          <AnimatedHeading
            as="h1"
            lines={hero.headline}
            splitBy="char"
            accentLine={1}
            accentClass="text-brand"
            className="mt-6 font-display text-[clamp(3.5rem,13vw,9rem)] font-bold uppercase leading-[0.85] tracking-tight"
          />

          <motion.p
            className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            {...fade(0.5)}
          >
            {hero.subheadline}
          </motion.p>

          <motion.div className="mt-9 flex flex-col gap-4 sm:flex-row" {...fade(0.65)}>
            <MagneticButton href="#register" variant="primary">
              {hero.ctaPrimary}
            </MagneticButton>
            <MagneticButton href="#committees" variant="secondary">
              {hero.ctaSecondary}
            </MagneticButton>
          </motion.div>

          <motion.dl className="mt-12 flex flex-wrap gap-6 sm:flex-nowrap sm:gap-12" {...fade(0.8)}>
            {hero.stats.map((s) => (
              <div key={s.label} className="text-center">
                <dd className="whitespace-nowrap font-display text-4xl font-bold tabular-nums text-blue sm:text-6xl">
                  <CountUp to={s.value} duration={5} />
                  {"suffix" in s ? s.suffix : ""}
                </dd>
                <dt className="mt-1 whitespace-nowrap font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
                  {s.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* right: floating generative cards */}
        <div className="relative mt-4 h-72 sm:h-96 lg:mt-0 lg:h-[26rem]">
          <a
            href={hero.venueMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SVIS Kandivali, Mumbai — open in Google Maps"
            className="glass animate-glow absolute inset-6 block overflow-hidden rounded-[2rem]"
          >
            <Image
              src="/kandivali.webp"
              alt="SVIS Kandivali, Mumbai"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-blue/20" />
          </a>
          <FloatingCard
            {...hero.floatingCards[0]}
            accent="gold"
            className="left-0 top-6"
            delay={0.9}
            floatDelay="0s"
          />
          <FloatingCard
            {...hero.floatingCards[1]}
            accent="blue"
            className="bottom-6 right-0"
            delay={1.05}
            floatDelay="-3s"
          />
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
        initial={reduce ? {} : { opacity: 0 }}
        animate={reduce ? {} : { opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-border-glass p-1.5">
          <motion.span
            className="h-2 w-1 rounded-full bg-brand"
            animate={reduce ? {} : { y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

function FloatingCard({
  label,
  value,
  accent,
  className,
  delay,
  floatDelay,
}: {
  label: string;
  value: string;
  accent: "gold" | "blue";
  className?: string;
  delay: number;
  floatDelay: string;
}) {
  const reduce = useReducedMotion();
  const dot = accent === "gold" ? "bg-brand" : "bg-blue";
  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, scale: 0.9 }}
      animate={reduce ? {} : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={`absolute w-40 sm:w-52 ${className}`}
    >
      <div
        className="glass animate-float rounded-2xl p-5"
        style={{
          ["--float-duration" as string]: "7s",
          animationDelay: floatDelay,
          background: "rgba(60, 60, 60, 0.5)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dot}`} />
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
            {label}
          </span>
        </div>
        <p className="mt-3 font-display text-lg font-semibold text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}
