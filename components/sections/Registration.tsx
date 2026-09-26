"use client";

import { useRef, useSyncExternalStore } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { registration } from "@/lib/content";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { Pill } from "@/components/primitives/Pill";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionIntro } from "@/components/primitives/SectionIntro";
import { LegacySectionIntro } from "@/components/primitives/legacy/LegacySectionIntro";
import { progressBetween } from "@/lib/motion";

const WIDE = "(min-width: 640px)";
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
/** True from the `sm` breakpoint up; false on the server and on phones. */
const useWide = () =>
  useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => false,
  );

/**
 * One step: its numeral lights from outline to gold as it crosses
 * mid-screen. From `sm` up the text also slides in; on a phone that slide
 * pushed the text past the screen edge mid-scroll, so there the numeral's
 * fill carries the motion alone.
 */
function Step({
  step,
  reduce,
}: {
  step: (typeof registration.steps)[number];
  reduce: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "center 50%"],
  });
  const lit = useTransform(scrollYProgress, progressBetween(0, 1));
  const x = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const slide = useWide() && !reduce;

  return (
    <li
      ref={ref}
      className="relative grid grid-cols-[auto_1fr] gap-4 py-9 first:pt-0 sm:gap-8 sm:py-16"
    >
      <span className="relative w-[1.75em] font-display text-[clamp(2.4rem,8vw,6.5rem)] font-black leading-[0.85] tracking-tight">
        <span aria-hidden className="text-outline">
          {step.index}
        </span>
        <motion.span
          aria-hidden
          style={reduce ? undefined : { opacity: lit }}
          className="absolute inset-0 text-brand"
        >
          {step.index}
        </motion.span>
      </span>
      <motion.div
        style={slide ? { x } : undefined}
        className="min-w-0 pt-1 sm:pt-2"
      >
        <h3 className="font-display text-xl font-bold leading-tight tracking-tight sm:text-3xl">
          {step.title}
        </h3>
        <p className="mt-2 max-w-[46ch] text-[0.95rem] leading-relaxed text-muted sm:mt-3 sm:text-base">
          {step.body}
        </p>
      </motion.div>
    </li>
  );
}

/**
 * Phones only: the section's original pre-redesign layout (eyebrow heading,
 * numbered step list, then the Register Now card with the details as
 * label/value rows), drawn in the countdown and stats panel shape: one
 * bordered block with hairline dividers rather than separate glass cards.
 */
function RegistrationMobile() {
  return (
    <div className="sm:hidden">
      <div id="register-heading-mobile">
        <LegacySectionIntro
          eyebrow={registration.eyebrow}
          heading={registration.heading}
          description={registration.description}
          accent="blue"
        />
      </div>

      <ol className="mt-12 overflow-hidden rounded-surface border border-hairline">
        {registration.steps.map((step, i) => (
          <Reveal
            as="li"
            key={step.index}
            delay={i * 0.08}
            className={`bg-background/60 ${i > 0 ? "border-t border-hairline" : ""}`}
          >
            <div className="group p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand/40 font-display text-sm font-bold text-brand transition-colors duration-300 group-active:bg-brand group-active:text-brand-fg">
                {step.index}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={0.15}>
        <div className="mt-8 overflow-hidden rounded-surface border border-hairline bg-background/60 p-6">
          <h3 className="font-display text-xl font-bold uppercase tracking-tight">
            Register Now
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {registration.card.body}
          </p>

          <div className="mt-6">
            <MagneticButton
              href={registration.card.href}
              variant="primary"
              className="w-full"
              ariaLabel={`${registration.card.button}, opens in a new tab`}
            >
              {registration.card.button}
            </MagneticButton>
          </div>

          <div className="mt-5 border-t border-hairline pt-5">
            <p className="text-xs leading-relaxed text-muted">
              {registration.card.delegation.note}
            </p>
            <div className="mt-3">
              <MagneticButton
                href={registration.card.delegation.href}
                variant="outline"
                className="w-full"
                ariaLabel={`${registration.card.delegation.button}, opens in a new tab`}
              >
                {registration.card.delegation.button}
              </MagneticButton>
            </div>
          </div>

          <dl className="mt-8 flex flex-col gap-4 border-t border-hairline pt-6">
            {registration.details.map((d) => (
              <div
                key={d.label}
                className="flex items-start justify-between gap-4"
              >
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
                  {d.label}
                </dt>
                <dd className="text-right text-sm font-medium text-foreground">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </div>
  );
}

export function Registration() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 70%", "end 60%"],
  });

  return (
    <section
      id="register"
      aria-labelledby="register-heading register-heading-mobile"
      className="relative px-5 py-28 sm:px-8 sm:py-40"
    >
      <RegistrationMobile />

      {/* From sm up: the redesigned layout. */}
      <div className="mx-auto hidden max-w-7xl sm:block">
        <SectionIntro
          id="register-heading"
          heading={registration.heading}
          description={registration.description}
          size="xl"
        />

        <div className="mt-16 grid gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* left: the form card, pinned while the steps scroll past. Only
            the card pins, so it always fits the viewport it is pinned to. */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <Reveal delay={0.15}>
                <div className="surface relative overflow-hidden p-7 sm:p-8">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-brand/20 blur-3xl"
                  />
                  <Pill variant="solid" live>
                    Registrations open
                  </Pill>
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-foreground/85">
                    {registration.card.body}
                  </p>

                  <MagneticButton
                    href={registration.card.href}
                    variant="primary"
                    arrow
                    strength={0.15}
                    className="mt-7 w-full"
                    ariaLabel={`${registration.card.button}, opens in a new tab`}
                  >
                    {registration.card.button}
                  </MagneticButton>

                  <div className="mt-6 border-t border-hairline pt-6">
                    <p className="text-sm leading-relaxed text-muted">
                      {registration.card.delegation.note}
                    </p>
                    <MagneticButton
                      href={registration.card.delegation.href}
                      variant="outline"
                      strength={0.15}
                      className="mt-4 w-full"
                      ariaLabel={`${registration.card.delegation.button}, opens in a new tab`}
                    >
                      {registration.card.delegation.button}
                    </MagneticButton>
                  </div>

                  <dl className="mt-7 grid grid-cols-1 gap-4 border-t border-hairline pt-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    {registration.details.map((d) => (
                      <div key={d.label}>
                        <dt className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
                          {d.label}
                        </dt>
                        <dd className="mt-1.5 text-sm font-medium leading-snug text-foreground">
                          {d.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>

          {/* right: the steps, with a rail that fills as you read down */}
          <div className="relative lg:col-span-6 lg:col-start-7">
            <div
              aria-hidden
              className="absolute bottom-0 left-0 top-0 w-px bg-hairline"
            >
              <motion.div
                style={reduce ? { scaleY: 1 } : { scaleY: scrollYProgress }}
                className="h-full w-full origin-top bg-brand"
              />
            </div>
            <ol ref={listRef} className="overflow-x-clip pl-6 sm:pl-12">
              {registration.steps.map((s) => (
                <Step key={s.index} step={s} reduce={!!reduce} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
