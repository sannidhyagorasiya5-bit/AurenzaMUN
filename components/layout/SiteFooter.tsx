import Image from "next/image";
import { hero, nav, site } from "@/lib/content";
import { NavLink } from "@/components/primitives/NavLink";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline px-5 py-12 sm:px-8 sm:py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:gap-10 md:text-left">
        <NavLink
          href="#top"
          className="flex items-center gap-3 transition-transform duration-200 active:scale-95 md:self-start"
        >
          <Image
            src="/logo.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          <span className="font-display text-xl font-extrabold tracking-tight">
            AURENZA<span className="text-brand">MUN</span>
          </span>
        </NavLink>

        <nav
          aria-label="Footer"
          className="flex max-w-xs flex-wrap justify-center gap-x-6 gap-y-3 sm:max-w-none md:grid md:grid-cols-3 md:gap-x-10"
        >
          {nav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted transition-colors hover:text-foreground active:text-brand"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <a
          href={hero.venueMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${site.copyright}, open in Google Maps`}
          className="w-full border-t border-hairline pt-6 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground active:text-brand md:w-auto md:border-0 md:pt-0 md:text-right md:text-[0.72rem] md:tracking-[0.16em]"
        >
          {site.copyright}
        </a>
      </div>
    </footer>
  );
}
