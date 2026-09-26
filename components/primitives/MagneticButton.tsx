"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { scrollToTarget } from "@/lib/scroll";
import { useCoarsePointer } from "@/lib/pointer";

type Variant = "primary" | "outline" | "secondary" | "ghost" | "disabled";

/* `fill` is the colour that wipes up from the bottom on hover/press; the
   label switches to its `onFill` colour as it passes. */
const variantClass: Record<Variant, { base: string; fill: string; onFill: string }> = {
  primary: {
    base: "bg-brand text-brand-fg font-semibold",
    fill: "bg-foreground",
    onFill: "group-hover/btn:text-background group-active/btn:text-background",
  },
  outline: {
    base: "border border-brand/60 text-brand font-semibold",
    fill: "bg-brand",
    onFill: "group-hover/btn:text-brand-fg group-active/btn:text-brand-fg",
  },
  secondary: {
    base: "border border-hairline-strong text-foreground",
    fill: "bg-foreground",
    onFill: "group-hover/btn:text-background group-active/btn:text-background",
  },
  ghost: {
    base: "text-muted hover:text-foreground active:text-brand",
    fill: "",
    onFill: "",
  },
  disabled: {
    base: "border border-dashed border-hairline-strong text-muted cursor-not-allowed",
    fill: "",
    onFill: "",
  },
};

/**
 * Pill CTA. With a fine pointer it leans toward the cursor and springs back
 * on leave; on every input a fill wipes up behind the label on hover/press.
 * Touch gets no magnetic pull, which would slide the button out from under
 * the thumb pressing it.
 *
 * Renders <a> when `href` is given, otherwise <button>. In-page anchors go
 * through Lenis; anything else opens in a new tab. "disabled" is a focusable
 * aria-disabled span with no effects.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  strength = 0.3,
  className = "",
  ariaLabel,
  arrow = false,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  strength?: number;
  className?: string;
  ariaLabel?: string;
  /** Trailing arrow that nudges up-right on hover. */
  arrow?: boolean;
}) {
  const reduce = useReducedMotion();
  const coarse = useCoarsePointer();
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const v = variantClass[variant];
  const disabled = variant === "disabled";
  const magnetic = !reduce && !disabled && !coarse;

  function handleMove(e: React.PointerEvent) {
    if (!magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (href?.startsWith("#")) {
      e.preventDefault();
      onClick?.();
      requestAnimationFrame(() => {
        if (scrollToTarget(href, !!reduce)) window.history.pushState(null, "", href);
      });
      return;
    }
    onClick?.();
  }

  const base = `group/btn relative isolate inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full px-7 py-3.5 text-[0.8rem] uppercase tracking-[0.14em] transition-colors duration-300 focus-visible:outline-2 ${v.base} ${className}`;

  const label = (
    <>
      {v.fill ? (
        <span
          aria-hidden
          className={`absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-full transition-transform duration-500 ease-out-expo group-hover/btn:scale-y-100 group-active/btn:scale-y-100 ${v.fill}`}
        />
      ) : null}
      <span
        className={`relative inline-flex items-center gap-2 transition-colors duration-300 ${v.onFill}`}
      >
        {children}
        {arrow ? (
          <ArrowUpRightIcon
            weight="bold"
            aria-hidden
            className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
          />
        ) : null}
      </span>
    </>
  );

  if (disabled) {
    return (
      <span aria-disabled className={base}>
        {label}
      </span>
    );
  }

  const common = {
    ref: ref as never,
    className: base,
    style: { x: sx, y: sy },
    onPointerMove: handleMove,
    onPointerUp: reset,
    onPointerCancel: reset,
    onPointerLeave: reset,
    whileTap: reduce ? undefined : { scale: 0.96 },
    "aria-label": ariaLabel,
  };

  if (href) {
    const offsite = !href.startsWith("#");
    return (
      <motion.a
        href={href}
        onClick={handleAnchorClick}
        {...(offsite ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...common}
      >
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
