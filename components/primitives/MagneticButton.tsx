"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { EASE } from "@/lib/motion";
import { smoothScrollTo } from "@/lib/scroll";
import { useCoarsePointer } from "@/lib/pointer";

type Variant = "primary" | "secondary" | "ghost" | "disabled";

/* Every state below is paired hover/active. `hover:` alone is scoped to
   @media (hover: hover), which left these buttons completely inert on a
   phone; `:active` is the touch half of the same state. */
const variantClass: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-fg font-semibold shadow-[0_10px_40px_-10px] shadow-brand/60 hover:shadow-brand/80 active:shadow-brand/90",
  secondary:
    "glass text-foreground border-border-glass hover:border-brand/60 hover:text-brand active:border-brand/70 active:text-brand",
  ghost: "text-muted hover:text-foreground active:text-brand",
  disabled:
    "border border-dashed border-border-glass text-muted cursor-not-allowed",
};

const RIPPLE = 130; // px diameter

/**
 * CTA that responds to whichever input the device has.
 *
 * With a pointer: eases toward the cursor while hovered, springs back on
 * leave. Under a finger: no magnetic pull — the button would slide out from
 * under the thumb pressing it — and instead a ripple spreads from the exact
 * touch point, which is the one signal a touchscreen reliably reads as
 * "that press landed". Both inputs get the tap-scale bounce.
 *
 * Renders <a> when href is given, otherwise <button>. The "disabled" variant
 * is a real, focusable element with aria-disabled and no effects at all
 * (used for "Coming Soon").
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
  const [ripple, setRipple] = useState<{ id: number; x: number; y: number } | null>(
    null,
  );
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  const disabled = variant === "disabled";
  const magnetic = !reduce && !disabled && !coarse;

  function handleMove(e: React.PointerEvent) {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function handleDown(e: React.PointerEvent) {
    handleMove(e);
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setRipple({ id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top });
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
    "relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-sm uppercase tracking-[0.15em] transition-colors duration-300 will-change-transform focus-visible:outline-2";

  /* The ripple is absolutely positioned and therefore out of flow, so the
     label carries the gap and sits above the wash on its own stacking
     context. */
  const label = (
    <>
      <AnimatePresence>
        {ripple ? (
          <motion.span
            key={ripple.id}
            aria-hidden
            initial={{ opacity: 0.35, scale: 0 }}
            animate={{ opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            onAnimationComplete={() =>
              setRipple((r) => (r?.id === ripple.id ? null : r))
            }
            style={{
              left: ripple.x - RIPPLE / 2,
              top: ripple.y - RIPPLE / 2,
              width: RIPPLE,
              height: RIPPLE,
            }}
            className="pointer-events-none absolute rounded-full bg-current"
          />
        ) : null}
      </AnimatePresence>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  const common = {
    ref: ref as never,
    className: `${base} ${variantClass[variant]} ${className}`,
    style: { x: sx, y: sy },
    onPointerMove: handleMove,
    onPointerDown: handleDown,
    onPointerUp: reset,
    onPointerCancel: reset,
    onPointerLeave: reset,
    whileTap: reduce ? undefined : { scale: 0.94 },
    "aria-label": ariaLabel,
  };

  if (disabled) {
    return (
      <motion.span
        aria-disabled
        className={`${base} ${variantClass.disabled} ${className}`}
      >
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </motion.span>
    );
  }

  if (href) {
    return (
      <motion.a href={href} onClick={handleAnchorClick} {...common}>
        {label}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} {...common}>
      {label}
    </motion.button>
  );
}
