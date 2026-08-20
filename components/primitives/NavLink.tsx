"use client";

import type { MouseEvent, ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { smoothScrollTo } from "@/lib/scroll";

/**
 * Anchor link that animates the scroll to its target section instead of
 * jumping instantly, without relying on native CSS smooth-scroll (which
 * gets starved and janky on this heavy page — see globals.css).
 */
export function NavLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const reduce = useReducedMotion();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!href.startsWith("#")) return;
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    e.preventDefault();
    onNavigate?.();
    smoothScrollTo(target, reduce ? 0 : 700);
    window.history.pushState(null, "", href);
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
