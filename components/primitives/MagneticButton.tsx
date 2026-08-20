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

type Variant = "primary" | "secondary" | "ghost" | "disabled";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-fg font-semibold shadow-[0_10px_40px_-10px] shadow-brand/60 hover:shadow-brand/80",
  secondary:
    "glass text-foreground border-border-glass hover:border-brand/60 hover:text-brand",
  ghost: "text-muted hover:text-foreground",
  disabled:
    "border border-dashed border-border-glass text-muted cursor-not-allowed",
};

/**
 * Magnetic CTA: the element eases toward the pointer while hovered, then
 * springs back on leave, with a tap-scale bounce. Renders <a> when href is
 * given, otherwise <button>. The "disabled" variant is a real, focusable
 * element with aria-disabled and no magnetic effect (used for "Coming Soon").
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
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  const disabled = variant === "disabled";
  const magnetic = !reduce && !disabled;

  function handleMove(e: React.PointerEvent) {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
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
    onPointerMove: handleMove,
    onPointerDown: handleMove,
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
