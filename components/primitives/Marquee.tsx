"use client";

import { Fragment } from "react";

/**
 * Infinite scrolling ticker. Duplicates the track twice and translates by
 * -50% for a seamless loop (GPU transform only). Decorative -> aria-hidden.
 * Pauses on hover; stops entirely under prefers-reduced-motion via globals.
 */
export function Marquee({
  items,
  speed = 28,
  direction = "left",
  separator = "✦",
  className = "",
}: {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
  separator?: string;
  className?: string;
}) {
  const track = direction === "left" ? "animate-marquee" : "animate-marquee-reverse";

  const group = (
    <div
      className={`flex shrink-0 items-center ${track}`}
      style={{ ["--marquee-duration" as string]: `${speed}s` }}
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className="px-6 font-display text-lg font-semibold uppercase tracking-[0.18em] text-foreground/80">
            {item}
          </span>
          <span className="text-brand" aria-hidden>
            {separator}
          </span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden
      className={`marquee-pause flex w-full overflow-hidden ${className}`}
    >
      {group}
      {group}
    </div>
  );
}
