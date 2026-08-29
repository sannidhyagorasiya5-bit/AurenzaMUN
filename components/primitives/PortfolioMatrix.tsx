/**
 * Blank spreadsheet frame for a committee's portfolio matrix — the back face
 * of a flipped committee panel.
 *
 * Deliberately empty: the allotments aren't public yet, so this renders the
 * grid chrome only and the cells get filled in later (pass `rows` through
 * from the data once it exists). Tinted off the same translucent-white
 * surface tokens as the glass panel behind it rather than a solid white
 * sheet, which would punch a hole in the dark canvas.
 */
export function PortfolioMatrix({
  rows = 6,
  cols = 3,
}: {
  rows?: number;
  cols?: number;
}) {
  const cell = "border-b border-r border-white/10 last:border-r-0";

  return (
    <div
      aria-hidden="true"
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
    >
      {/* Column headers — the darker banded strip a spreadsheet reads by */}
      <div
        className="grid shrink-0 bg-white/[0.08]"
        style={{ gridTemplateColumns: `1.75rem repeat(${cols}, minmax(0, 1fr))` }}
      >
        <div className={`${cell} h-6`} />
        {Array.from({ length: cols }, (_, c) => (
          <div key={c} className={`${cell} h-6`} />
        ))}
      </div>

      {/* Body — flex-1 rows so the sheet always fills the panel exactly */}
      <div
        className="grid min-h-0 flex-1"
        style={{
          gridTemplateColumns: `1.75rem repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="contents">
            {/* Row-number gutter, tinted like the header strip */}
            <div className={`${cell} bg-white/[0.06]`} />
            {Array.from({ length: cols }, (_, c) => (
              <div key={c} className={`${cell} ${r % 2 === 1 ? "bg-white/[0.02]" : ""}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
