"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import type { Accent, Committee } from "@/lib/content";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { Pill } from "@/components/primitives/Pill";
import { TrackTabs, type TabItem } from "@/components/primitives/TrackTabs";

const accentEmblem: Record<Accent, string> = {
  blue: "from-blue/30 via-transparent to-brand/15 text-blue",
  gold: "from-brand/30 via-transparent to-blue/15 text-brand",
  ice: "from-ice/30 via-transparent to-brand/15 text-ice",
};

const accentDot: Record<Accent, string> = {
  blue: "bg-blue",
  gold: "bg-brand",
  ice: "bg-ice",
};

const accentLabel: Record<Accent, string> = {
  blue: "text-blue",
  gold: "text-brand",
  ice: "text-ice",
};

/* Portfolio index badges reuse the light-chip pair, which keeps the midnight
   blue readable at this size; gold stays on its own tint. */
const accentBadge: Record<Accent, string> = {
  blue: "bg-blue-chip text-blue-deep",
  gold: "bg-brand/20 text-brand",
  ice: "bg-ice-chip text-ice-deep",
};

/** "LOK SABHA" -> "LS", "MAHABHARATA" -> "MAHA", "C.C.C" -> "CCC". */
function monogram(abbr: string) {
  const words = abbr.replace(/\./g, "").split(/\s+/).filter(Boolean);
  if (words.length > 1) return words.map((w) => w[0]).join("").slice(0, 3);
  return (words[0] ?? "").slice(0, 4);
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

/**
 * Committee detail dialog: agenda + focus areas on one tab, the portfolio
 * matrix on the other. Rendered in a portal so no transformed ancestor can
 * clip it. Closes on Esc, on the backdrop, and on the register CTA.
 */
export function CommitteeModal({
  committee,
  accent,
  portfolioNote,
  onClose,
}: {
  committee: Committee;
  accent: Accent;
  portfolioNote: string;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState("overview");

  const portfolios = committee.portfolios ?? [];
  const hasPortfolios = portfolios.length > 0;
  const portfolioLabel = committee.portfolioLabel ?? "PORTFOLIOS";

  const tabs: TabItem[] = [
    { id: "overview", label: "Overview", accent },
    ...(hasPortfolios ? [{ id: "portfolios", label: portfolioLabel, accent }] : []),
  ];

  /* Lock the page behind the dialog and hand focus to the panel, restoring
     both — including the card that opened it — on close. */
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (e.shiftKey && (current === first || current === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  /* Only ever rendered client-side, from a click — but the portal target
     still has to exist before we reach for it. */
  if (typeof document === "undefined") return null;

  const titleId = `committee-${committee.abbr.replace(/\W+/g, "-")}-title`;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6 sm:py-10">
      <motion.div
        className="absolute inset-0 bg-background/85 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="glass relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl shadow-2xl shadow-black/60 focus-visible:outline-2"
      >
        {/* header */}
        <div className="shrink-0 px-6 pt-6 sm:px-8 sm:pt-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close committee details"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-surface-strong hover:text-foreground focus-visible:outline-2"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-4 pr-10 sm:gap-5">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border-glass bg-gradient-to-br font-display text-sm font-bold tracking-tight sm:h-16 sm:w-16 sm:text-base ${accentEmblem[accent]}`}
              aria-hidden
            >
              {monogram(committee.abbr)}
            </div>

            <div className="min-w-0">
              <Pill accent={accent} variant="solid">
                {committee.kind}
              </Pill>
              <h3
                id={titleId}
                className="mt-2 font-display text-2xl font-bold uppercase leading-none tracking-tight sm:text-3xl"
              >
                {committee.abbr}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">
                {committee.name}
              </p>
            </div>
          </div>
        </div>

        {/* tabs */}
        {hasPortfolios ? (
          <div className="shrink-0 border-b border-border-glass px-6 pb-5 pt-5 sm:px-8">
            <TrackTabs
              tabs={tabs}
              value={tab}
              onChange={setTab}
              idBase={`committee-${committee.abbr.replace(/\W+/g, "-")}`}
            />
          </div>
        ) : (
          <div className="shrink-0 border-b border-border-glass pt-5" />
        )}

        {/* body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -10 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {tab === "overview" ? (
                <div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                    Description
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                    {committee.description}
                  </p>

                  <div className="mt-6 rounded-2xl border border-border-glass bg-surface p-5">
                    <p
                      className={`font-mono text-[0.65rem] uppercase tracking-[0.2em] ${accentLabel[accent]}`}
                    >
                      Official Agenda
                    </p>
                    <p className="mt-2 font-display text-base font-semibold leading-snug tracking-tight sm:text-lg">
                      &ldquo;{committee.agenda}&rdquo;
                    </p>
                  </div>

                  <p className="mt-7 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                    Key Focus Areas
                  </p>
                  <ul className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {committee.focus.map((f) => (
                      <li key={f} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                        <span
                          className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accentDot[accent]}`}
                          aria-hidden
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                    {portfolioLabel} &mdash; {portfolios.length} available
                  </p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {portfolios.map((name, i) => (
                      <li
                        key={name}
                        className="flex items-center gap-2.5 rounded-xl border border-border-glass bg-surface px-3 py-2"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[0.6rem] font-semibold ${accentBadge[accent]}`}
                          aria-hidden
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate text-xs leading-snug" title={name}>
                          {name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-center font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
                    {portfolioNote}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* footer CTA */}
        <div className="shrink-0 border-t border-border-glass p-5 sm:px-8">
          <MagneticButton
            href="#register"
            onClick={onClose}
            strength={0.15}
            className="w-full"
            ariaLabel={`Register for ${committee.abbr}`}
          >
            Register for {committee.abbr}
          </MagneticButton>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
