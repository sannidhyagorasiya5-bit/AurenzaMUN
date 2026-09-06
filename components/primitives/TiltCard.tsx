"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import type { Accent } from "@/lib/content";
import { useCoarsePointer, useProximity } from "@/lib/proximity";

/* `data-active` is the touch stand-in for `:hover` — it is set when the card
   is the one nearest the middle of the screen, so a phone gets the same glow
   a mouse gets. Both spellings are listed so the classes stay statically
   visible to Tailwind. */
const accentGlow: Record<Accent, string> = {
  blue: "hover:border-blue/50 hover:shadow-blue/20 data-[active=true]:border-blue/50 data-[active=true]:shadow-blue/20",
  gold: "hover:border-brand/50 hover:shadow-brand/20 data-[active=true]:border-brand/50 data-[active=true]:shadow-brand/20",
  ice: "hover:border-ice/50 hover:shadow-ice/20 data-[active=true]:border-ice/50 data-[active=true]:shadow-ice/20",
};

const MAX_TILT = 7; // degrees — pointer-driven
const SCROLL_TILT = 4; // degrees — scroll-driven, so gentler: it is always moving

/**
 * Glass card with a subtle 3D tilt toward the pointer and an accent-tinted
 * glow on hover.
 *
 * On a touchscreen there is no pointer to lean toward and no hover to glow
 * for, so both are driven by the card's distance from the centre of the
 * viewport instead: it tilts as it travels up the screen and lights up as it
 * passes the middle. Dragging a finger across the card still steers it
 * directly, and releasing settles it back to whatever the scroll position
 * calls for. Reduced-motion / interactive={false} keep the card static.
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
  const coarse = useCoarsePointer();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });

  const tilt = interactive && !reduce;

  /* Where the card should sit when nothing is touching it: flat on a desktop,
     wherever the scroll position puts it on a phone. */
  const resting = useRef({ rotX: 0, rotY: 0 });
  const dragging = useRef(false);

  /* The glow follows proximity on every touch device; the tilt only where the
     card is interactive, matching which cards lean toward a mouse. */
  const active = useProximity(ref, coarse, (_nearness, offsetY, offsetX) => {
    if (!tilt) return;
    /* A card below the centre has the virtual pointer up near its top edge,
       which is the sign convention handleMove uses. */
    resting.current = { rotX: offsetY * SCROLL_TILT, rotY: -offsetX * SCROLL_TILT };
    if (dragging.current) return;
    rx.set(resting.current.rotX);
    ry.set(resting.current.rotY);
  });

  function handleMove(e: React.PointerEvent) {
    if (!tilt || !ref.current) return;
    dragging.current = true;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * MAX_TILT * 2);
    rx.set(-py * MAX_TILT * 2);
  }

  function reset() {
    dragging.current = false;
    rx.set(resting.current.rotX);
    ry.set(resting.current.rotY);
  }

  return (
    <motion.div
      ref={ref}
      data-active={active ? "true" : "false"}
      onPointerMove={handleMove}
      /* A tap would otherwise snap the card to the finger and straight back
         out again, so on touch only a real drag steers it. */
      onPointerDown={coarse ? undefined : handleMove}
      onPointerUp={reset}
      onPointerCancel={reset}
      onPointerLeave={reset}
      style={
        tilt
          ? { rotateX: srx, rotateY: sry, transformPerspective: 900 }
          : undefined
      }
      className={`group/card glass rounded-3xl shadow-lg shadow-black/30 transition-[border-color,box-shadow] duration-300 ${accentGlow[accent]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
