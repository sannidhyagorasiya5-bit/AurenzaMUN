"use client";

import { Fragment, useRef } from "react";

/**
 * Infinite scrolling ticker. Duplicates the track twice and translates by
 * -50% for a seamless loop (GPU transform only). Decorative -> aria-hidden.
 * Parks under a resting pointer: hover on desktop, a held finger on touch.
 * The held flag is written straight to the DOM rather than held in state —
 * pausing a CSS animation should not cost a React render. Stops entirely
 * under prefers-reduced-motion via globals.
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
  const ref = useRef<HTMLDivElement>(null);
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

  /* pointercancel is the important one: the browser fires it as soon as it
     claims the gesture for scrolling, so flicking past the ticker does not
     leave it parked. */
  function hold(held: boolean) {
    if (ref.current) ref.current.dataset.held = String(held);
  }

  return (
    <div
      ref={ref}
      aria-hidden
      onPointerDown={() => hold(true)}
      onPointerUp={() => hold(false)}
      onPointerCancel={() => hold(false)}
      onPointerLeave={() => hold(false)}
      className={`marquee-pause flex w-full overflow-hidden ${className}`}
    >
      {group}
      {group}
    </div>
  );
}
