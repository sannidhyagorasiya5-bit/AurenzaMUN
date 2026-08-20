"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import type { Accent } from "@/lib/content";

const accentGlow: Record<Accent, string> = {
  blue: "hover:border-blue/50 hover:shadow-blue/20",
  gold: "hover:border-brand/50 hover:shadow-brand/20",
  ice: "hover:border-ice/50 hover:shadow-ice/20",
};

const MAX_TILT = 7; // degrees

/**
 * Glass card with a subtle 3D hover tilt toward the pointer and an
 * accent-tinted glow on hover. Reduced-motion / interactive={false} keep
 * the card static (glow-only on hover).
 */
export function TiltCard({
  children,
  accent = "gold",
  interactive = true,
  className = "",
}: {
  children: ReactNode;
  accent?: Accent;
  interactive?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });

  const tilt = interactive && !reduce;

  function handleMove(e: React.MouseEvent) {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * MAX_TILT * 2);
    rx.set(-py * MAX_TILT * 2);
  }

  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={
        tilt
          ? { rotateX: srx, rotateY: sry, transformPerspective: 900 }
          : undefined
      }
      className={`glass rounded-3xl shadow-lg shadow-black/30 transition-[border-color,box-shadow] duration-300 ${accentGlow[accent]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
