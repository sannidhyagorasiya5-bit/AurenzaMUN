"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { EASE } from "@/lib/motion";

/**
 * Stat counter that runs from 0 to `to` the first time it scrolls into view.
 * The number lives in a motion value rendered directly by <motion.span>, so
 * the count never re-renders React. Reduced motion shows the final value.
 */
export function CountUp({
  to,
  duration = 2.4,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const value = useMotionValue(reduce ? to : 0);
  const rounded = useTransform(value, (v) => Math.round(v));

  useEffect(() => {
    if (reduce) {
      value.set(to);
      return;
    }
    if (!inView) return;
    const controls = animate(value, to, { duration, ease: EASE });
    return () => controls.stop();
  }, [inView, reduce, to, duration, value]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
