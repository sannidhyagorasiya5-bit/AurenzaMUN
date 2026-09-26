import { useSyncExternalStore } from "react";

/**
 * A one-off read of what the device can afford, for the few effects that
 * scale their own cost (the shader, the voxel backdrop). Client only: call
 * it inside an effect, never during render.
 *
 *   - "high": a mouse or trackpad (desktops, laptops).
 *   - "mid":  a touch-first device (phones, tablets, foldables).
 *   - "low":  touch plus few cores, little memory, or Data Saver on —
 *             budget Android phones, older iPhones and iPads.
 */
export type PerfTier = "low" | "mid" | "high";

let cached: PerfTier | null = null;

/** Data Saver / Lite mode is on: skip optional downloads. */
export function prefersSaveData() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return !!nav.connection?.saveData;
}

export function isTouchPrimary() {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

export function perfTier(): PerfTier {
  if (cached) return cached;

  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory ?? 4;

  if (prefersSaveData() || memory <= 2) cached = "low";
  else if (isTouchPrimary()) cached = cores <= 4 || memory <= 3 ? "low" : "mid";
  else cached = "high";

  return cached;
}

const noSubscribe = () => () => {};

/**
 * True where CSS scroll-driven animations run (Chrome/Edge/Samsung
 * Internet 115+, Safari 26+). Those animations are driven by the scroll
 * position on the compositor thread, so they stay in step with the finger
 * at any refresh rate, however busy the page's main thread is. The server
 * snapshot assumes support: the CSS side is gated by @supports anyway, and
 * the script fallback mounts after hydration where support is missing.
 */
export function useScrollTimelines() {
  return useSyncExternalStore(
    noSubscribe,
    () => CSS.supports("animation-timeline: view()"),
    () => true,
  );
}
