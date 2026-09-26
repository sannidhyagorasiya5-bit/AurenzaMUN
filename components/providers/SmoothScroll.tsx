"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling for the whole page. Lenis drives the real window
 * scroll position, so Motion's useScroll/whileInView keep working untouched.
 * Touch is smoothed too (syncTouch), with Lenis's own inertia standing in
 * for native momentum. Reduced motion skips Lenis entirely, and lib/scroll
 * falls back to native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchInertiaExponent: 1.7,
      autoRaf: true,
    });
    registerLenis(lenis);

    return () => {
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
