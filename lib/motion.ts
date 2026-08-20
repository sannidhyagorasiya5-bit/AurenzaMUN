/**
 * Shared animation constants + variants so primitives and sections
 * never redefine easings/durations/stagger. Import from "motion/react"
 * in client components; these are plain objects, safe to import anywhere.
 */
import type { Variants } from "motion/react";

/** Expressive ease-out — the house curve. */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const; // slight overshoot / bounce

export const DURATION = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
} as const;

export const STAGGER = 0.08;

/** Generic fade + rise. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

/** Container that staggers its direct children (which use fadeUp / wordReveal). */
export const containerStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER, delayChildren: 0.05 },
  },
};

/** Word/line slides up from behind an overflow-hidden mask. */
export const wordReveal: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

/** Shared viewport config for whileInView reveals. */
export const VIEWPORT = { once: true, amount: 0.3 } as const;
