"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling for the whole page. Lenis drives the real window
 * scroll position, so Motion's useScroll/whileInView keep working untouched.
 * Touch keeps native momentum (syncTouch off), and reduced motion skips
 * Lenis entirely.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
