"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

/**
 * Surface whose border and fill light up under the cursor.
 *
 * Adapted from 21st.dev's Spotlight Card (preetsuthar17). The original kept
 * the pointer position in React state, re-rendering on every mousemove; here
 * it is written straight to two CSS variables, so tracking costs no renders.
 * Touch has no hover, so a press lights the card from the touch point.
 */
export function SpotlightCard({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  function track(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  }

  return (
    <Tag
      ref={ref as never}
      onPointerMove={track}
      onPointerDown={track}
      className={`group/spot surface relative isolate overflow-hidden transition-[border-color,transform] duration-500 ease-out-expo hover:border-hairline-strong active:scale-[0.99] ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100 group-active/spot:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgba(229,192,99,0.13), transparent 65%)",
        }}
      />
      {children}
    </Tag>
  );
}
