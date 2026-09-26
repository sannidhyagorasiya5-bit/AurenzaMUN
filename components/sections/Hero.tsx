"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { hero } from "@/lib/content";
import { EASE, progressBetween } from "@/lib/motion";
import { AnimatedHeading } from "@/components/primitives/AnimatedHeading";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { Pill } from "@/components/primitives/Pill";
import { LegacyPill } from "@/components/primitives/legacy/LegacyPill";
import { ShaderBackdrop } from "@/components/primitives/ShaderBackdrop";

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  /* As the hero scrolls away the paint flow sinks and fades out, handing
     over to the site-wide voxel backdrop, while the type lifts faster than
     the page: a two-plane parallax rather than a plain slide. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  /* A function transform, not a range: see progressBetween. */
  const sceneOpacity = useTransform(
    scrollYProgress,
    (v) => 1 - progressBetween(0.2, 0.95)(v),
  );
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay },
        };

  return (
    <section
      ref={ref}
      id="top"
      aria-label="AurenzaMUN introduction"
      className="relative isolate flex flex-col overflow-hidden px-5 pb-12 pt-24 sm:min-h-[100dvh] sm:px-8 sm:pb-14 sm:pt-28"
    >
      {/* The paint flow. Its lower edge is masked away so it dissolves into
          the voxel backdrop instead of ending on a hard line. */}
      <motion.div
        aria-hidden
        style={
          reduce
            ? undefined
            : { y: sceneY, scale: sceneScale, opacity: sceneOpacity }
        }
        className="absolute inset-0 -z-20 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
      >
        <ShaderBackdrop />
      </motion.div>
      {/* Legibility: the lede sits bottom-left, so the scene is weighted a
          little darker there. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(7,8,11,0.45),transparent_60%)]"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <motion.div
          className="flex flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-3"
          {...fade(0.2)}
        >
          <Pill
            variant="plate"
            className="shrink-0 whitespace-nowrap max-sm:px-2.5! max-sm:text-[0.56rem]! max-sm:tracking-[0.06em]!"
          >
            {hero.badges[0]}
          </Pill>
          <a
            href={hero.venueMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${hero.badges[1]}, open in Google Maps`}
            className="inline-block shrink-0 transition-all duration-200 hover:opacity-80 active:scale-95 active:opacity-70"
          >
            {/* The original filled venue chip, restored as it was. */}
            <LegacyPill
              accent="blue"
              dot
              className="cursor-pointer whitespace-nowrap max-sm:gap-1.5! max-sm:px-2.5! max-sm:text-[0.56rem]! max-sm:tracking-[0.06em]!"
            >
              {hero.badges[1]}
            </LegacyPill>
          </a>
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: typeY }}
          className="mt-12 sm:mt-auto sm:pt-16"
        >
          <AnimatedHeading
            as="h1"
            lines={hero.headline}
            splitBy="char"
            accentLine={1}
            animateOnMount
            delay={0.25}
            lineClassName={["", "sm:text-right"]}
            className="font-display text-[clamp(3.5rem,16.5vw,16rem)] font-bold uppercase leading-[0.82] tracking-tight"
          />

          <div className="mt-8 grid gap-8 sm:mt-6 lg:-mt-[clamp(4rem,9vw,9rem)] lg:grid-cols-12">
            <div className="lg:col-span-5">
              <motion.p
                className="max-w-[36ch] text-lg leading-relaxed text-foreground/85 sm:text-xl"
                {...fade(0.9)}
              >
                {hero.lede}
              </motion.p>
              <motion.div
                className="mt-8 flex flex-col gap-3 sm:flex-row"
                {...fade(1.05)}
              >
                <MagneticButton href="#register" variant="primary" arrow>
                  {hero.ctaPrimary}
                </MagneticButton>
                <MagneticButton href="#committees" variant="secondary">
                  {hero.ctaSecondary}
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
