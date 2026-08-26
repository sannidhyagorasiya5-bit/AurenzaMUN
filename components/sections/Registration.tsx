"use client";

import { registration } from "@/lib/content";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionIntro } from "@/components/primitives/SectionIntro";
import { TiltCard } from "@/components/primitives/TiltCard";

export function Registration() {
  return (
    <section
      id="register"
      aria-labelledby="register-heading"
      className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div id="register-heading">
          <SectionIntro
            eyebrow={registration.eyebrow}
            heading={registration.heading}
            description={registration.description}
            accent="blue"
          />
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          {/* steps */}
          <ol className="grid gap-4 sm:grid-cols-2">
            {registration.steps.map((step, i) => (
              <Reveal as="li" key={step.index} delay={i * 0.08}>
                <div className="glass group h-full rounded-2xl p-6 transition-colors duration-300 hover:border-brand/40">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand/40 font-display text-sm font-bold text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-fg">
                    {step.index}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          {/* register card */}
          <Reveal delay={0.15}>
            <TiltCard accent="gold" interactive={false} className="flex h-full flex-col p-8">
              <h3 className="font-display text-xl font-bold uppercase tracking-tight">
                Register Now
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{registration.card.body}</p>

              <div className="mt-6">
                <MagneticButton variant="disabled" className="w-full">
                  {registration.card.button}
                </MagneticButton>
              </div>

              <dl className="mt-8 flex flex-col gap-4 border-t border-border-glass pt-6">
                {registration.details.map((d) => (
                  <div key={d.label} className="flex items-start justify-between gap-4">
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
                      {d.label}
                    </dt>
                    <dd className="text-right text-sm font-medium text-foreground">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
