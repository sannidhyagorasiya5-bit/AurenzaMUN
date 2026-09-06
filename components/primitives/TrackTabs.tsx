"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Accent } from "@/lib/content";

export type TabItem = {
  id: string;
  label: string;
  accent: Accent;
};

/* The active blue/ice tab fills with a light chip so its label can be true
   midnight blue and still read at 10:1. */
const accentActiveText: Record<Accent, string> = {
  blue: "text-blue-deep",
  gold: "text-brand",
  ice: "text-ice-deep",
};

const accentPill: Record<Accent, string> = {
  blue: "bg-blue-chip border-blue-chip",
  gold: "bg-brand/15 border-brand/40",
  ice: "bg-ice-chip border-ice-chip",
};

/**
 * Accessible tablist with a sliding active indicator (shared layoutId).
 * Roving arrow-key navigation. `value`/`onChange` are controlled by parent.
 *
 * A phone gets a two-across grid rather than a wrapping row: "College
 * Committees" is wider than half a 390px screen at the desktop type size,
 * so flex-wrap put every tab on its own line and the control read as three
 * stacked blocks. An odd tab out spans both columns and centres under them
 * instead of hanging off to the left. Counted rather than hardcoded, since
 * the committee dialog reuses this with two tabs.
 */
export function TrackTabs({
  tabs,
  value,
  onChange,
  idBase = "track",
}: {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  idBase?: string;
}) {
  const reduce = useReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  /* An odd count leaves the last tab alone on its row of the mobile grid. */
  const oddOneOut = tabs.length % 2 === 1;

  function handleKey(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Committee tracks"
      className="glass grid w-full grid-cols-2 gap-1.5 rounded-2xl p-1.5 sm:inline-flex sm:w-auto sm:flex-wrap sm:rounded-full"
    >
      {tabs.map((tab, i) => {
        const active = tab.id === value;
        const odd = oddOneOut && i === tabs.length - 1;
        return (
          <motion.button
            key={tab.id}
            whileTap={reduce ? undefined : { scale: 0.92 }}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`${idBase}-tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`${idBase}-panel-${tab.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKey(e, i)}
            /* Padding lives entirely in the branch: listing px-3 and px-8
               together would leave which one wins up to Tailwind's emit
               order rather than to this component. */
            className={`relative rounded-full py-2.5 text-[0.7rem] font-medium uppercase leading-tight tracking-[0.08em] transition-colors duration-300 sm:text-xs sm:tracking-[0.12em] ${
              odd
                ? "col-span-2 justify-self-center px-8 sm:col-span-1 sm:justify-self-auto sm:px-6"
                : "px-3 sm:px-6"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`${idBase}-active-pill`}
                className={`absolute inset-0 rounded-full border ${accentPill[tab.accent]}`}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 ${
                active
                  ? accentActiveText[tab.accent]
                  : "text-muted hover:text-foreground active:text-foreground"
              }`}
            >
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
