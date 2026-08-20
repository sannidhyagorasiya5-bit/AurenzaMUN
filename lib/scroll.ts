function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Animates the page to an element's position over a fixed duration,
 * honoring the element's `scroll-margin-top` (used for sticky-header
 * offset elsewhere on the site). Duration 0 jumps instantly — used for
 * prefers-reduced-motion.
 */
export function smoothScrollTo(target: HTMLElement, duration = 700) {
  const scrollMarginTop = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const startY = window.scrollY;
  const targetY = target.getBoundingClientRect().top + startY - scrollMarginTop;
  const diff = targetY - startY;

  if (duration <= 0 || Math.abs(diff) < 1) {
    window.scrollTo(0, targetY);
    return;
  }

  const start = performance.now();

  function step(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    window.scrollTo(0, startY + diff * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
