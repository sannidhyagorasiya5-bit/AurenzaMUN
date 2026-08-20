"use client";

import { motion, useReducedMotion } from "motion/react";
import { containerStagger, wordReveal, VIEWPORT } from "@/lib/motion";

type HeadingTag = "h1" | "h2" | "h3";

/**
 * Kinetic two-line all-caps headline. Each word slides up from behind a
 * mask with a stagger. The second line takes the accent color (the
 * "color split"). Split tokens are aria-hidden; the full phrase is exposed
 * once via sr-only so screen readers announce it normally.
 */
export function AnimatedHeading({
  lines,
  as = "h2",
  accentLine = 1,
  accentClass = "text-brand",
  className = "",
  splitBy = "word",
}: {
  lines: [string, string] | [string];
  as?: HeadingTag;
  /** which line index gets the accent color (default: second line) */
  accentLine?: 0 | 1;
  accentClass?: string;
  className?: string;
  splitBy?: "word" | "char";
}) {
  const reduce = useReducedMotion();
  const Tag = as;
  const fullText = lines.join(" ");

  if (reduce) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className={`block ${i === accentLine ? accentClass : ""}`}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      <span className="sr-only">{fullText}</span>
      <motion.span
        aria-hidden
        className="block select-none"
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {lines.map((line, lineIndex) => {
          const tokens = splitBy === "char" ? Array.from(line) : line.split(" ");
          return (
            <span
              key={lineIndex}
              className={`block ${lineIndex === accentLine ? accentClass : ""}`}
            >
              {tokens.map((token, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom"
                  style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
                >
                  <motion.span className="inline-block" variants={wordReveal}>
                    {token === " " ? " " : token}
                  </motion.span>
                  {splitBy === "word" && i < tokens.length - 1 ? " " : null}
                </span>
              ))}
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
