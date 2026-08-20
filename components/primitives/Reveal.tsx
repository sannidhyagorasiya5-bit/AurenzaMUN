"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { DURATION, EASE, VIEWPORT } from "@/lib/motion";

type RevealTag = "div" | "section" | "li" | "span" | "article";

/**
 * Scroll-reveal workhorse: fades + rises into view once.
 * Honors prefers-reduced-motion by rendering the final state immediately.
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 24,
  amount = VIEWPORT.amount,
  className = "",
}: {
  children: ReactNode;
  as?: RevealTag;
  delay?: number;
  y?: number;
  amount?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: VIEWPORT.once, amount }}
      transition={{ duration: DURATION.base, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}
