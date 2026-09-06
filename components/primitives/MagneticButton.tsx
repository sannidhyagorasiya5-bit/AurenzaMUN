"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { smoothScrollTo } from "@/lib/scroll";
import { useCoarsePointer, useProximity } from "@/lib/proximity";

type Variant = "primary" | "secondary" | "ghost" | "disabled";

/* `data-active` mirrors each `hover:` rule for touch, where the button lights
   up as it passes the middle of the screen instead. Spelled out in full so
   Tailwind can see every class statically. */
const variantClass: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-fg font-semibold shadow-[0_10px_40px_-10px] shadow-brand/60 hover:shadow-brand/80 data-[active=true]:shadow-brand/80",
  secondary:
    "glass text-foreground border-border-glass hover:border-brand/60 hover:text-brand data-[active=true]:border-brand/60 data-[active=true]:text-brand",
  ghost: "text-muted hover:text-foreground data-[active=true]:text-foreground",
  disabled:
    "border border-dashed border-border-glass text-muted cursor-not-allowed",
};

/**
 * Magnetic CTA: the element eases toward the pointer while hovered, then
 * springs back on leave, with a tap-scale bounce. Renders <a> when href is
 * given, otherwise <button>. The "disabled" variant is a real, focusable
 * element with aria-disabled and no magnetic effect (used for "Coming Soon").
 *
 * On touch there is no hover, so the accent it would pick up from a mouse is
 * taken as it nears the centre of the screen. The magnetic pull still works —
 * a finger dragged over the button is a pointer — but at reduced strength, so
 * the button never slides out from under the thumb that is pressing it.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  strength = 0.35,
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  strength?: number;
  className?: string;
  ariaLabel?: string;
}) {
  const reduce = useReducedMotion();
  const coarse = useCoarsePointer();
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  const disabled = variant === "disabled";
  const magnetic = !reduce && !disabled;
  const pull = coarse ? strength * 0.6 : strength;

  const active = useProximity(ref, coarse && !disabled);

  function handleMove(e: React.PointerEvent) {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * pull);
    y.set((e.clientY - (rect.top + rect.height / 2)) * pull);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (href?.startsWith("#")) {
      const target = document.querySelector<HTMLElement>(href);
      if (target) {
        e.preventDefault();
        smoothScrollTo(target, reduce ? 0 : 700);
        window.history.pushState(null, "", href);
      }
    }
    onClick?.();
  }

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm uppercase tracking-[0.15em] transition-colors duration-300 will-change-transform focus-visible:outline-2";

  const common = {
    ref: ref as never,
    className: `${base} ${variantClass[variant]} ${className}`,
    style: { x: sx, y: sy },
    "data-active": active ? "true" : "false",
    onPointerMove: handleMove,
    /* On touch a plain tap would lunge the button toward the finger and back;
       only a drag should move it. */
    onPointerDown: coarse ? undefined : handleMove,
    onPointerUp: reset,
    onPointerCancel: reset,
    onPointerLeave: reset,
    whileTap: disabled ? undefined : { scale: 0.94 },
    "aria-label": ariaLabel,
  };

  if (disabled) {
    return (
      <motion.span
        aria-disabled
        className={`${base} ${variantClass.disabled} ${className}`}
      >
        {children}
      </motion.span>
    );
  }

  if (href) {
    return (
      <motion.a href={href} onClick={handleAnchorClick} {...common}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} {...common}>
      {children}
    </motion.button>
  );
}
