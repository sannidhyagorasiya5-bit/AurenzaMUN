"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { isTouchPrimary } from "@/lib/device";
import { registerLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling for the whole page. Lenis drives the real window
 * scroll position, so Motion's useScroll/whileInView keep working untouched.
 * Lenis only smooths the wheel, so touch-first devices (phones, tablets)
 * skip it entirely and keep pure native scrolling with no per-frame loop,
 * as does reduced motion. lib/scroll falls back to native for both.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (isTouchPrimary()) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
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
