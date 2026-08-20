"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  useInView,
  useReducedMotion,
} from "motion/react";
import { DURATION, EASE } from "@/lib/motion";

/**
 * Animated stat counter. Counts from 0 to `to` when first scrolled into
 * view. Renders the final value immediately on reduced-motion (and the
 * initial SSR paint shows 0 -> corrected on mount, but reduced-motion and
 * no-JS both resolve to the real number).
 */
export function CountUp({
  to,
  duration = DURATION.slow,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (reduce || !inView) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
