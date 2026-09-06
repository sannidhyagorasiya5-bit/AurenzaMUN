"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * True on devices with no real hover — phones and tablets.
 *
 * Every reactive affordance on this site is pointer-driven (card tilt, accent
 * glows, magnetic buttons, the step-number fill), and Tailwind scopes `hover:`
 * under `@media (hover: hover)`. On touch that means the whole layer silently
 * does nothing. Components use this to switch on the scroll-driven equivalent
 * below, so the media query they react to is exactly the one that disables
 * their hover styles.
 */
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return coarse;
}

/* ============================================================
   Viewport-centre proximity engine
   ============================================================ */

/** (nearness 0..1 at dead centre, offsetY -1..1, offsetX -1..1) */
type Listener = (nearness: number, offsetY: number, offsetX: number) => void;

type Entry = { el: HTMLElement; notify: Listener; visible: boolean };

/**
 * A touchscreen has no pointer to follow, so the centre of the viewport
 * stands in for one: whatever sits nearest the middle of the screen is what
 * the reader is looking at. Scrolling then drives the same tilt and glow that
 * hovering drives on a desktop, off the same normalised numbers.
 *
 * One shared scroll listener, one rAF per frame and one IntersectionObserver
 * serve every subscriber. Measuring twenty cards independently on every scroll
 * event is exactly the kind of main-thread load this page already goes out of
 * its way to avoid (see the notes in globals.css), and offscreen cards are
 * skipped entirely.
 */
const entries = new Map<HTMLElement, Entry>();
let frame = 0;
let observer: IntersectionObserver | null = null;

function clamp(n: number) {
  return Math.max(-1, Math.min(1, n));
}

function measure() {
  frame = 0;
  const midY = window.innerHeight / 2;
  const midX = window.innerWidth / 2;

  for (const entry of entries.values()) {
    if (!entry.visible) continue;
    const rect = entry.el.getBoundingClientRect();
    /* Half a viewport of reach: a card fades to zero as it hits the top or
       bottom edge, which keeps roughly one card lit at a time on a phone. */
    const offsetY = clamp((rect.top + rect.height / 2 - midY) / midY);
    const offsetX = clamp((rect.left + rect.width / 2 - midX) / midX);
    entry.notify(1 - Math.abs(offsetY), offsetY, offsetX);
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(measure);
}

function ensureObserver() {
  observer ??= new IntersectionObserver(
    (records) => {
      for (const record of records) {
        const entry = entries.get(record.target as HTMLElement);
        if (!entry) continue;
        entry.visible = record.isIntersecting;
        if (!record.isIntersecting) entry.notify(0, 0, 0);
      }
      schedule();
    },
    { rootMargin: "15% 0px" },
  );
  return observer;
}

function observe(el: HTMLElement, notify: Listener) {
  if (entries.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
  }

  entries.set(el, { el, notify, visible: false });
  ensureObserver().observe(el);
  schedule();

  return () => {
    observer?.unobserve(el);
    entries.delete(el);
    if (entries.size > 0) return;

    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    observer?.disconnect();
    observer = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };
}

/** Past this nearness an element counts as "hovered" and takes its accent. */
const ACTIVE_AT = 0.55;

/**
 * Subscribes `ref` to the proximity engine while `enabled`.
 *
 * `onChange` fires on scroll frames and is meant to write into motion values,
 * not state — it runs at frame rate. The returned boolean is the coarse "is
 * this the focused element" flag, which flips rarely and is safe to render
 * from (it drives `data-active`, the touch stand-in for `:hover`).
 */
export function useProximity(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  onChange?: Listener,
) {
  const [active, setActive] = useState(false);

  /* Latest-callback ref: components pass a fresh closure every render, and
     re-subscribing to the engine each time would thrash the observer. */
  const handler = useRef(onChange);
  useEffect(() => {
    handler.current = onChange;
  });

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) {
      setActive(false);
      return;
    }

    return observe(el, (nearness, offsetY, offsetX) => {
      handler.current?.(nearness, offsetY, offsetX);
      const next = nearness > ACTIVE_AT;
      setActive((prev) => (prev === next ? prev : next));
    });
  }, [ref, enabled]);

  return active;
}
