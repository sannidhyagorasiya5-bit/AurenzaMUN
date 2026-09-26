"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Voxel cube stack (exported from Unicorn Studio's Amphorae template) as a
 * faint ghost behind the whole site: tinted gold, blurred, and screened onto
 * the plain dark background at 10% so the clip's black adds nothing and only
 * the lit cube faces show, barely.
 *
 * It only moves when the page does. Page position maps onto the clip, so
 * the stack builds as you read down and is complete at the footer:
 *   - behind that position (scrolling down), the video *plays* toward it at
 *     a rate proportional to the gap, because this file's sparse keyframes
 *     make every seek cost ~70ms, and playback decodes smoothly;
 *   - ahead of it (scrolling up), it seeks back, one seek in flight at a
 *     time so requests never pile up;
 *   - at rest it is paused.
 * Reduced motion shows a single, fully built frame.
 */
const SRC = "/voxel-cube-stack.mp4";

/** Within this many seconds of the target the clip counts as caught up. */
const CATCH_UP = 0.06;
/** Past this far ahead of the target, seek back instead of waiting. */
const REWIND = 0.2;

export function SiteBackdrop() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    if (reduce) {
      const still = () => {
        v.currentTime = v.duration * 0.8;
      };
      if (v.readyState >= 1) still();
      else v.addEventListener("loadedmetadata", still, { once: true });
      return () => v.removeEventListener("loadedmetadata", still);
    }

    let seeking = false;
    const onSeeked = () => {
      seeking = false;
    };
    v.addEventListener("seeked", onSeeked);

    /* One rAF loop reading the scroll position (Lenis moves the page on its
       own frames), rather than a scroll listener. */
    let raf = 0;
    function loop() {
      raf = requestAnimationFrame(loop);
      if (!v || !v.duration || v.readyState < 2) return;

      const target = progress() * (v.duration - 0.05);
      const gap = target - v.currentTime;

      if (gap > CATCH_UP) {
        v.playbackRate = Math.min(4, Math.max(0.35, gap * 1.6));
        if (v.paused) void v.play().catch(() => {});
      } else if (gap < -REWIND) {
        if (!v.paused) v.pause();
        if (!seeking) {
          seeking = true;
          v.currentTime = target;
        }
      } else if (!v.paused) {
        v.pause();
      }
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("seeked", onSeeked);
      v.pause();
    };
  }, [reduce]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-background">
      {/* Greyscale source, pushed to gold: sepia gives warmth, saturation
          and a small hue turn land it on the brand gold. Scaled up so the
          blur never shows a soft edge. */}
      <video
        ref={ref}
        src={SRC}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-[0.1] mix-blend-screen [filter:grayscale(1)_sepia(1)_saturate(2.1)_hue-rotate(-6deg)_brightness(0.85)_blur(8px)]"
      />
    </div>
  );
}
