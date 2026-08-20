import Image from "next/image";
import { hero, nav, site } from "@/lib/content";
import { NavLink } from "@/components/primitives/NavLink";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border-glass px-5 py-14 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <a href="#top" className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight">
          <Image
            src="/logo.jpg"
            alt="AurenzaMUN"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span>
            <span className="text-brand">AURENZA</span>
            <span>MUN</span>
          </span>
        </a>

        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-7 gap-y-3">
          {nav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-foreground"
            >
              {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
            </NavLink>
          ))}
        </nav>

        <a
          href={hero.venueMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${site.copyright} — open in Google Maps`}
          className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-foreground"
        >
          {site.copyright}
        </a>
      </div>
    </footer>
  );
}
