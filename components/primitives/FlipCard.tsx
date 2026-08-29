"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Accent } from "@/lib/content";
import { EASE } from "@/lib/motion";

const accentGlow: Record<Accent, string> = {
  blue: "hover:border-blue/50 hover:shadow-blue/20",
  gold: "hover:border-brand/50 hover:shadow-brand/20",
  ice: "hover:border-ice/50 hover:shadow-ice/20",
};

/**
 * Glass panel that flips on click to reveal a second face.
 *
 * This is TiltCard's sibling, not a wrapper around it: the pointer tilt and
 * the flip both drive `rotateY` on the same element, so a card can do one or
 * the other. Panels that flip give up the tilt and keep the hover glow.
 *
 * Both faces are absolutely positioned, so the container carries the height
 * (`h-full` inside a stretched grid row, plus a min-height that guarantees
 * the back's spreadsheet has room to breathe). Reduced motion swaps the 3D
 * rotation for a plain cross-fade.
 */
export function FlipCard({
  front,
  back,
  accent = "gold",
  frontLabel,
  backLabel,
  className = "",
}: {
  front: ReactNode;
  back: ReactNode;
  accent?: Accent;
  /** Accessible name for the front face's flip-to-back button. */
  frontLabel: string;
  /** Accessible name for the back face's flip-to-front button. */
  backLabel: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);

  const face = `glass absolute inset-0 flex flex-col rounded-3xl p-7 text-left shadow-lg shadow-black/30 transition-[border-color,box-shadow] duration-300 ${accentGlow[accent]} [backface-visibility:hidden] [-webkit-backface-visibility:hidden]`;

  return (
    <div className={`relative h-full min-h-72 [perspective:1200px] ${className}`}>
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={reduce ? {} : { rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <motion.button
          type="button"
          aria-label={frontLabel}
          aria-pressed={flipped}
          onClick={() => setFlipped(true)}
          inert={flipped}
          animate={reduce ? { opacity: flipped ? 0 : 1 } : {}}
          className={face}
        >
          {front}
        </motion.button>

        <motion.button
          type="button"
          aria-label={backLabel}
          aria-pressed={flipped}
          onClick={() => setFlipped(false)}
          inert={!flipped}
          // Motion owns this face's 180deg flip rather than a CSS class: it
          // writes transforms straight to element.style on hydration and would
          // clobber a class-based one.
          initial={reduce ? { opacity: 0 } : { rotateY: 180 }}
          animate={reduce ? { opacity: flipped ? 1 : 0 } : { rotateY: 180 }}
          className={face}
        >
          {back}
        </motion.button>
      </motion.div>
    </div>
  );
}
