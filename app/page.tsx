import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Countdown } from "@/components/sections/Countdown";
import { Committees } from "@/components/sections/Committees";
import { Registration } from "@/components/sections/Registration";
import { Secretariat } from "@/components/sections/Secretariat";
import { Resources } from "@/components/sections/Resources";
import { SocialMedia } from "@/components/sections/SocialMedia";
import { Marquee } from "@/components/primitives/Marquee";
import { SiteBackdrop } from "@/components/primitives/SiteBackdrop";
import { CursorFlow } from "@/components/primitives/CursorFlow";
import { hero } from "@/lib/content";

export default function Home() {
  return (
    <>
      <SiteBackdrop />
      <CursorFlow />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <div className="border-y border-hairline py-6">
          <Marquee items={[...hero.marquee]} />
        </div>
        <Manifesto />
        <Countdown />
        <Committees />
        <Registration />
        <Secretariat />
        <Resources />
        <SocialMedia />
      </main>
      <SiteFooter />
    </>
  );
}
