"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(hover: none)";

/* One MediaQueryList for the whole page, created lazily so nothing touches
   `window` during SSR. Every card and button on the page reads the same one. */
let mql: MediaQueryList | null = null;

function query() {
  if (!mql) mql = window.matchMedia(QUERY);
  return mql;
}

function subscribe(onChange: () => void) {
  const mq = query();
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => query().matches;

/**
 * True when the primary input has no hover state — phones, tablets, most
 * touch laptops in tablet mode.
 *
 * Everything gated on this is a *pointer-only* behaviour being switched off,
 * so `false` is the safe server snapshot: markup renders the desktop
 * treatment and hydration corrects it before a finger can reach the screen.
 */
export function useCoarsePointer() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
