/**
 * Marks an element `data-shown` the first time enough of it scrolls into
 * view, then stops watching it. CSS does the rest (see `.reveal` and
 * `.rise` in globals.css), so an entrance costs one attribute write and
 * then runs as a compositor transition, instead of a script updating the
 * element's style every frame. No React state either: nothing re-renders.
 *
 * One IntersectionObserver per threshold, shared by every element using it.
 */
const observers = new Map<number, IntersectionObserver>();

export function observeOnce(el: Element, amount: number) {
  let io = observers.get(amount);
  if (!io) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-shown", "");
          observer.unobserve(e.target);
        }
      },
      { threshold: amount },
    );
    observers.set(amount, observer);
    io = observer;
  }
  io.observe(el);
  const current = io;
  return () => current.unobserve(el);
}
