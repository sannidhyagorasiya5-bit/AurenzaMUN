"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { STAGGER, wordReveal, VIEWPORT } from "@/lib/motion";

type HeadingTag = "h1" | "h2" | "h3";

/**
 * Kinetic two-line headline. Each word (or character) slides up from behind
 * a mask with a stagger; the accent line takes the gold. Split tokens are
 * aria-hidden and the phrase is exposed once via sr-only.
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
  const reduce = useReducedMotion();
  const Tag = as;
  const fullText = lines.join(" ");

  if (reduce) {
    return (
      <Tag id={id} className={className}>
        {lines.map((line, i) => (
          <span
            key={i}
            className={`block ${i === accentLine ? accentClass : ""} ${lineClassName[i] ?? ""}`}
          >
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  const trigger = animateOnMount
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: VIEWPORT };

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{fullText}</span>
      <motion.span
        aria-hidden
        className="block"
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: 0.05 + delay,
              staggerChildren: splitBy === "char" ? 0.045 : STAGGER,
            },
          },
        }}
        initial="hidden"
        {...trigger}
      >
        {lines.map((line, lineIndex) => {
          const tokens =
            splitBy === "char" ? Array.from(line) : line.split(" ");
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
                    <motion.span className="inline-block" variants={wordReveal}>
                      {token === " " ? " " : token}
                    </motion.span>
                  </span>
                  {/* Outside the clipped box, or the space collapses. */}
                  {splitBy === "word" && i < tokens.length - 1 ? " " : null}
                </Fragment>
              ))}
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
