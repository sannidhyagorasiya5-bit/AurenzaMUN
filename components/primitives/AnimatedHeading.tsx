"use client";

import type { CSSProperties } from "react";
import { Fragment, useEffect, useRef } from "react";
import { STAGGER, VIEWPORT } from "@/lib/motion";
import { observeOnce } from "@/lib/inview";

type HeadingTag = "h1" | "h2" | "h3";

/**
 * Kinetic two-line headline. Each word (or character) slides up from behind
 * a mask with a stagger; the accent line takes the gold. Split tokens are
 * aria-hidden and the phrase is exposed once via sr-only.
 *
 * All in CSS (`.rise` in globals.css): each token carries its index and the
 * stylesheet turns that into a staggered delay. On scroll-in a shared
 * observer flips one attribute and the tokens transition on the
 * compositor; `animateOnMount` (the hero) is a plain keyframe animation
 * that starts as soon as the page paints, before any script has loaded.
 */
export function AnimatedHeading({
  lines,
  as = "h2",
  id,
  accentLine = 1,
  accentClass = "text-brand",
  className = "",
  lineClassName = [],
  splitBy = "word",
  animateOnMount = false,
  delay = 0,
}: {
  lines: [string, string] | [string];
  as?: HeadingTag;
  id?: string;
  /** which line index gets the accent colour (default: second line) */
  accentLine?: 0 | 1 | -1;
  accentClass?: string;
  className?: string;
  /** Extra classes per line, e.g. to indent the second line. */
  lineClassName?: string[];
  splitBy?: "word" | "char";
  /** Play on mount instead of on scroll-into-view (the hero). */
  animateOnMount?: boolean;
  delay?: number;
}) {
  const Tag = as;
  const fullText = lines.join(" ");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || animateOnMount) return;
    return observeOnce(el, VIEWPORT.amount);
  }, [animateOnMount]);

  const timing = {
    "--rise-delay": `${0.05 + delay}s`,
    "--rise-stagger": `${splitBy === "char" ? 0.045 : STAGGER}s`,
  } as CSSProperties;

  /* One running index across both lines, as the stagger always had. */
  let index = 0;

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{fullText}</span>
      <span
        ref={ref}
        aria-hidden
        className={`block ${animateOnMount ? "rise-now" : "rise"}`}
        style={timing}
      >
        {lines.map((line, lineIndex) => {
          const tokens = splitBy === "char" ? Array.from(line) : line.split(" ");
          return (
            <span
              key={lineIndex}
              className={`block ${splitBy === "char" ? "whitespace-nowrap" : ""} ${
                lineIndex === accentLine ? accentClass : ""
              } ${lineClassName[lineIndex] ?? ""}`}
            >
              {tokens.map((token, i) => (
                <Fragment key={i}>
                  <span
                    className="inline-block overflow-hidden align-bottom"
                    style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
                  >
                    <span
                      className="rise-token inline-block"
                      style={{ "--i": index++ } as CSSProperties}
                    >
                      {token === " " ? " " : token}
                    </span>
                  </span>
                  {/* Outside the clipped box, or the space collapses. */}
                  {splitBy === "word" && i < tokens.length - 1 ? " " : null}
                </Fragment>
              ))}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
