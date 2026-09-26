"use client";

import { Fragment, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { StarFourIcon } from "@phosphor-icons/react/dist/ssr";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/**
 * Kinetic ticker bound to scroll velocity: it idles along on its own, speeds
 * up as the page is scrolled and reverses when the reader scrolls back up.
 * Driven entirely by motion values, so it never re-renders React. Static
 * under reduced motion. Decorative, so aria-hidden.
 */
export function Marquee({
  items,
  baseVelocity = -2.2,
  className = "",
}: {
  items: string[];
  /** Percent of one track per second; negative runs leftward. */
  baseVelocity?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    baseX.set(baseX.get() + move);
  });

  const group = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <Fragment key={i}>
          <span
            className={`px-6 font-display text-lg font-extrabold uppercase leading-none tracking-tight ${
              i % 2 ? "text-outline" : "text-foreground"
            }`}
          >
            {item}
          </span>
          <StarFourIcon weight="fill" className="h-4 w-4 shrink-0 text-brand" />
        </Fragment>
      ))}
    </div>
  );

  return (
    <div aria-hidden className={`flex w-full overflow-hidden ${className}`}>
      <motion.div className="flex w-max shrink-0" style={{ x }}>
        {group}
        {group}
      </motion.div>
    </div>
  );
}
