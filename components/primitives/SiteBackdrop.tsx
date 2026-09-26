"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { isTouchPrimary, perfTier, prefersSaveData } from "@/lib/device";

/**
 * Voxel cube stack (exported from Unicorn Studio's Amphorae template) as a
 * faint gold ghost behind the whole site. Page position maps onto the clip,
 * so the stack builds as you read down and is complete at the footer.
 *
 * It used to be a live <video> under a blur, a colour filter and a blend
 * mode, seeking or playing on every scroll frame. That full-screen filter
 * chain and the ~70ms seeks (the file's keyframes are sparse) were the
 * single biggest cost on phones. Now, once the page has loaded and gone
 * idle, the clip is sampled once into a few dozen small frames with the
 * tint and the 10% screen already baked into their pixels, and the video is
 * released. Scrolling then only crossfades two neighbouring frames onto one
 * small opaque canvas, which the browser upscales; the upscale is what
 * gives the old blur's softness, for free.
 *
 * Reduced motion bakes a single, nearly built frame. Data Saver skips the
 * download and leaves the plain dark background.
 *
 * Touch-first devices (phones, tablets) never load the clip. They get only
 * the light it cast: a warm pool rising from the bottom, where the stack
 * builds, and a faint highlight top right. It is two static gradients on
 * one fixed layer, brightening as the page is read, the way the stack
 * does, through opacity alone, which the compositor handles without a
 * repaint.
 */
const SRC = "/voxel-cube-stack.mp4";

const BG = [7, 8, 11] as const; // --background
const GOLD = [229, 192, 99] as const; // --brand
/** The old layer's opacity, now baked into the pixels. */
const STRENGTH = 0.1;
/** CSS px per baked px: the softness the old 8px blur gave. */
const SOFTNESS = 5;

const FRAMES = { low: 24, mid: 36, high: 48 } as const;

/** The same gold as the baked frames, at about their brightest. */
const LIGHT = [
  "radial-gradient(130% 65% at 50% 105%, rgba(229,192,99,0.085) 0%, rgba(229,192,99,0.03) 45%, transparent 75%)",
  "radial-gradient(70% 45% at 95% 0%, rgba(229,192,99,0.05) 0%, transparent 70%)",
].join(", ");

/** Touch devices: the backdrop's light without the clip. */
function useLightOnly(ref: React.RefObject<HTMLDivElement | null>, reduce: boolean | null) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !isTouchPrimary()) return;
    if (reduce) {
      el.style.opacity = "0.85";
      return;
    }
    /* Where scroll-driven animations exist, globals.css runs the brightening
       on the compositor and no script runs per frame at all. */
    if (CSS.supports("animation-timeline: scroll()")) return;

    let maxScroll = 1;
    const measure = () => {
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      el.style.opacity = String(0.45 + 0.55 * p);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const ro = new ResizeObserver(() => {
      measure();
      kick();
    });
    ro.observe(document.body);
    window.addEventListener("scroll", kick, { passive: true });
    measure();
    update();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", kick);
    };
  }, [ref, reduce]);
}

/** Resolves once the seek lands, or after a timeout so one bad seek never stalls the bake. */
function seek(v: HTMLVideoElement, t: number) {
  return new Promise<void>((resolve) => {
    const done = () => {
      clearTimeout(timer);
      v.removeEventListener("seeked", done);
      resolve();
    };
    const timer = setTimeout(done, 3000);
    v.addEventListener("seeked", done);
    v.currentTime = t;
  });
}

function whenReady(v: HTMLVideoElement) {
  return new Promise<boolean>((resolve) => {
    if (v.readyState >= 2) return resolve(true);
    const ok = () => finish(true);
    const fail = () => finish(false);
    const timer = setTimeout(fail, 15000);
    function finish(r: boolean) {
      clearTimeout(timer);
      v.removeEventListener("loadeddata", ok);
      v.removeEventListener("error", fail);
      resolve(r);
    }
    v.addEventListener("loadeddata", ok);
    v.addEventListener("error", fail);
    v.preload = "auto";
    v.load();
    /* iOS will not fetch frame data for a video nobody has played. */
    void v.play().then(() => v.pause()).catch(() => {});
  });
}

/** Coarse-to-fine order (every 8th frame, then every 4th, ...), so the whole scroll range is covered early. */
function bakeOrder(n: number) {
  const order: number[] = [];
  const seen = new Set<number>();
  for (let stride = 8; stride >= 1; stride /= 2) {
    for (let i = 0; i < n; i += stride) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  if (!seen.has(n - 1)) order.splice(1, 0, n - 1);
  return order;
}

export function SiteBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useLightOnly(lightRef, reduce);

  useEffect(() => {
    const canvas = ref.current;
    const v = videoRef.current;
    if (!canvas || !v || prefersSaveData() || isTouchPrimary()) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let cancelled = false;
    let raf = 0;
    const frames: (HTMLCanvasElement | null)[] = [];
    const count = reduce ? 1 : FRAMES[perfTier()];

    /* -- scroll -> frame ------------------------------------------------ */
    let maxScroll = 1;
    const measure = () => {
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const target = () => Math.min(1, Math.max(0, window.scrollY / maxScroll));

    let shown = -1;
    let drawn = -1;

    function draw(p: number) {
      if (!ctx || !canvas) return;
      const f = p * (count - 1);
      let lo = -1;
      let hi = -1;
      for (let i = Math.floor(f); i >= 0; i--) if (frames[i]) { lo = i; break; }
      for (let i = Math.ceil(f); i < count; i++) if (frames[i]) { hi = i; break; }
      if (lo < 0) lo = hi;
      if (hi < 0) hi = lo;
      if (lo < 0) return;

      ctx.globalAlpha = 1;
      ctx.drawImage(frames[lo]!, 0, 0);
      if (hi !== lo) {
        ctx.globalAlpha = (f - lo) / (hi - lo);
        ctx.drawImage(frames[hi]!, 0, 0);
      }
      drawn = p;
    }

    /* Eases the shown position toward the scroll position, then sleeps
       until the page moves again: nothing runs while the reader is still. */
    function step() {
      raf = 0;
      const t = reduce ? 0 : target();
      shown = shown < 0 ? t : shown + (t - shown) * 0.14;
      if (Math.abs(t - shown) < 0.0004) shown = t;
      if (Math.abs(shown - drawn) > 0.0002) draw(shown);
      if (shown !== t) raf = requestAnimationFrame(step);
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const ro = new ResizeObserver(() => {
      measure();
      kick();
    });

    /* -- bake -------------------------------------------------------------- */
    async function bake() {
      if (!v || !(await whenReady(v)) || cancelled || !v.duration) return;
      v.pause();

      const aspect = v.videoWidth / v.videoHeight || 16 / 9;
      /* Size the frames from how wide the clip is shown once it covers the
         screen, so the softness matches on a phone and on a monitor. */
      const shownWidth = Math.max(window.innerWidth, window.innerHeight * aspect);
      const w = Math.round(Math.min(400, Math.max(64, shownWidth / SOFTNESS)));
      const h = Math.max(1, Math.round(w / aspect));
      canvas!.width = w;
      canvas!.height = h;
      ctx!.fillStyle = `rgb(${BG.join(",")})`;
      ctx!.fillRect(0, 0, w, h);

      /* Two-step downscale, so fine voxel edges average rather than alias. */
      const mid = document.createElement("canvas");
      mid.width = w * 2;
      mid.height = h * 2;
      const mctx = mid.getContext("2d", { willReadFrequently: false })!;
      mctx.imageSmoothingQuality = "high";

      const span = Math.max(0, v.duration - 0.05);
      const order = reduce ? [0] : bakeOrder(count);

      for (const i of order) {
        if (cancelled) return;
        await seek(v, reduce ? v.duration * 0.8 : (i / Math.max(1, count - 1)) * span);
        if (cancelled) return;

        mctx.drawImage(v, 0, 0, mid.width, mid.height);
        const out = document.createElement("canvas");
        out.width = w;
        out.height = h;
        const octx = out.getContext("2d", { willReadFrequently: true })!;
        octx.imageSmoothingQuality = "high";
        octx.drawImage(mid, 0, 0, w, h);

        /* grayscale -> gold -> screened at 10% over the page background */
        const img = octx.getImageData(0, 0, w, h);
        const d = img.data;
        for (let p = 0; p < d.length; p += 4) {
          const l = Math.min(1, ((0.2126 * d[p] + 0.7152 * d[p + 1] + 0.0722 * d[p + 2]) / 255) * 1.1) * 0.85;
          for (let c = 0; c < 3; c++) {
            const tint = (GOLD[c] / 255) * l;
            const bg = BG[c] / 255;
            d[p + c] = Math.round((bg + STRENGTH * tint * (1 - bg)) * 255);
          }
        }
        octx.putImageData(img, 0, 0);
        frames[i] = out;

        drawn = -1;
        kick();
        if (!canvas!.style.opacity) canvas!.style.opacity = "1";
        /* Let scrolling and input breathe between samples. */
        await new Promise((r) => setTimeout(r, 16));
      }

      /* Every frame is in hand: free the decoder and the download. */
      v.removeAttribute("src");
      v.load();
    }

    measure();
    ro.observe(document.body);
    window.addEventListener("scroll", kick, { passive: true });

    /* Start only once the page has loaded and gone idle, so the clip never
       competes with the hero, the fonts or the first scroll. */
    const hasIdle = "requestIdleCallback" in window;
    let idleId = 0;
    const start = () => {
      idleId = hasIdle
        ? window.requestIdleCallback(() => void bake(), { timeout: 2500 })
        : window.setTimeout(() => void bake(), 1200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("load", start);
      if (hasIdle) window.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
      v.pause();
    };
  }, [reduce]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-background">
      <canvas
        ref={ref}
        width={1}
        height={1}
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000 [@media(hover:none)_and_(pointer:coarse)]:hidden"
      />
      {/* Touch only (the same query as isTouchPrimary, so it is right from
          the first paint): the light, in place of the canvas. */}
      <div
        ref={lightRef}
        className="backdrop-light absolute inset-0 hidden opacity-45 [@media(hover:none)_and_(pointer:coarse)]:block"
        style={{ backgroundImage: LIGHT, willChange: "opacity" }}
      />
      {/* Only a source to sample from; never shown. */}
      <video
        ref={videoRef}
        src={SRC}
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        className="absolute left-0 top-0 h-px w-px opacity-0"
      />
    </div>
  );
}
