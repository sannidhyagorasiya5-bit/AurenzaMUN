"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { nav } from "@/lib/content";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { NavLink } from "@/components/primitives/NavLink";

const panelList = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } },
};

const panelItem = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

export function SiteHeader() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  /* useScroll instead of a raw scroll listener: one batched subscription
     shared with the progress rule below, off the React render path. */
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  /* A reload can restore mid-page, where no scroll event ever fires. Read
     it back after the first paint rather than during the effect body, so
     the correction never cascades a render out of hydration. */
  useEffect(() => {
    const id = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    return () => cancelAnimationFrame(id);
  }, []);

  // Lock scroll + close on Escape while mobile menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border-glass bg-background/90 py-3"
          : "border-b border-transparent py-5"
      }`}
    >
      <div className="relative z-50 mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-foreground transition-transform duration-200 active:scale-95"
        >
          <Image
            src="/logo.jpeg"
            alt="AurenzaMUN"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
            priority
          />
          <span>
            <span className="text-brand">AURENZA</span>
            <span>MUN</span>
          </span>
        </a>

        {/* desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="group relative font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted transition-colors hover:text-foreground"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand transition-all duration-300 group-hover:w-full" />
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <MagneticButton href="#register" variant="primary" className="!px-6 !py-3 !text-xs">
            Register Now
          </MagneticButton>
        </div>

        {/* mobile toggle */}
        <motion.button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          whileTap={reduce ? undefined : { scale: 0.85 }}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-0.5 w-6 transition-all duration-300 ${
              open ? "translate-y-2 rotate-45 bg-brand" : "bg-foreground"
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-foreground transition-opacity duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 transition-all duration-300 ${
              open ? "-translate-y-2 -rotate-45 bg-brand" : "bg-foreground"
            }`}
          />
        </motion.button>
      </div>

      {/* Reading position. On a one-page site this is the only thing that
          tells a thumb how much is left, and a phone has no scrollbar. */}
      <motion.div
        aria-hidden
        style={{ scaleX: reduce ? 0 : progress }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-brand"
      />

      {/* mobile panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Tapping anywhere off the menu closes it, which is what a
                thumb expects and Escape alone could not offer. */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-background/70 md:hidden"
            />

            <motion.nav
              aria-label="Mobile"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 top-full z-50 border-b border-border-glass bg-background px-5 py-6 md:hidden"
            >
              <motion.ul
                className="flex flex-col gap-5"
                variants={panelList}
                initial="hidden"
                animate="visible"
              >
                {nav.map((item) => (
                  <motion.li key={item.href} variants={reduce ? undefined : panelItem}>
                    <NavLink
                      href={item.href}
                      onNavigate={() => setOpen(false)}
                      className="group relative inline-flex font-mono text-sm uppercase tracking-[0.18em] text-muted transition-colors hover:text-foreground active:text-brand"
                    >
                      {item.label}
                      <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brand transition-[width] duration-300 group-hover:w-full group-active:w-full" />
                    </NavLink>
                  </motion.li>
                ))}
                <motion.li className="pt-2" variants={reduce ? undefined : panelItem}>
                  <MagneticButton href="#register" variant="primary" className="w-full">
                    Register Now
                  </MagneticButton>
                </motion.li>
              </motion.ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
