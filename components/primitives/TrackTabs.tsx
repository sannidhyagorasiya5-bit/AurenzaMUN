"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import type { Accent } from "@/lib/content";

export type TabItem = {
  id: string;
  label: string;
  accent: Accent;
};

const accentActiveText: Record<Accent, string> = {
  blue: "text-blue",
  gold: "text-brand",
  ice: "text-ice",
};

const accentPill: Record<Accent, string> = {
  blue: "bg-blue/15 border-blue/40",
  gold: "bg-brand/15 border-brand/40",
  ice: "bg-ice/15 border-ice/40",
};

/**
 * Accessible tablist with a sliding active indicator (shared layoutId).
 * Roving arrow-key navigation. `value`/`onChange` are controlled by parent.
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
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

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
      className="glass inline-flex flex-wrap gap-1 rounded-full p-1.5"
    >
      {tabs.map((tab, i) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
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
            className="relative rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-300 sm:px-6"
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
                active ? accentActiveText[tab.accent] : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
