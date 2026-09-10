"use client";

import type { TeamGroup, TeamMember } from "@/lib/content";
import { secretariat } from "@/lib/content";
import { GenerativeBackground } from "@/components/primitives/GenerativeBackground";
import { Pill } from "@/components/primitives/Pill";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionIntro } from "@/components/primitives/SectionIntro";
import { TiltCard } from "@/components/primitives/TiltCard";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("");

const slug = (label: string) => label.toLowerCase().replace(/[^a-z]+/g, "-");

/* auto-rows-fr holds every row to the same height, so an announced panel and
   an empty one read as two states of one grid rather than as a filled tier
   with filler stacked under it. */
const GRID = "grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3";

/** One team panel: an announced member, or a dashed placeholder when absent. */
function Panel({ member, index }: { member?: TeamMember; index: number }) {
  return (
    <Reveal
      as="li"
      /* Stagger across a row, not across the whole grid — an index-wide delay
         would still be animating in the last row long after the reader got
         there. */
      delay={(index % secretariat.panelsPerRow) * 0.08}
      className="list-none"
    >
      <TiltCard
        accent="gold"
        interactive={!!member}
        className={`flex h-full flex-col p-7 ${member ? "" : "border-dashed"}`}
      >
        {member ? (
          <>
            {/* Initials stand in until real photography lands. */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border-glass bg-gradient-to-br from-blue/25 via-transparent to-brand/20">
              <span className="font-display text-3xl font-bold text-foreground/80">
                {initials(member.name)}
              </span>
            </div>

            <Pill accent="gold" variant="solid" size="sm" className="mt-6 self-start">
              {member.role}
            </Pill>
            <h4 className="mt-4 font-display text-2xl font-bold tracking-tight">
              {member.name}
            </h4>
          </>
        ) : (
          <div
            aria-hidden
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-dashed border-border-glass bg-surface"
          >
            <span className="h-2 w-2 rounded-full bg-brand/40" />
          </div>
        )}
      </TiltCard>
    </Reveal>
  );
}

/** One tier of the roster: sub-heading, hairline, then its grid of panels. */
function Group({ group }: { group: TeamGroup }) {
  const id = `crew-${slug(group.label)}`;
  /* A tier with `panelRows` holds its reserved grid; one without ends with
     its last announced name. */
  const panels = group.panelRows
    ? group.panelRows * secretariat.panelsPerRow
    : group.members.length;

  return (
    <>
      <Reveal className="mt-16 flex items-center gap-5">
        <h3
          id={id}
          className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl"
        >
          {group.label}
        </h3>
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-brand/40 to-transparent" />
      </Reveal>

      <ul aria-labelledby={id} className={`mt-8 ${GRID}`}>
        {Array.from({ length: panels }, (_, i) => {
          /* Indexing past the array is the point here, so read it as optional
             rather than letting the type promise a member. */
          const m = i < group.members.length ? group.members[i] : undefined;
          return <Panel key={m ? m.name : `${id}-slot-${i}`} member={m} index={i} />;
        })}
      </ul>
    </>
  );
}

export function Secretariat() {
  return (
    <section
      id="crew"
      aria-labelledby="crew-heading"
      className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
    >
      <GenerativeBackground />

      <div className="mx-auto max-w-6xl">
        <div id="crew-heading">
          <SectionIntro
            eyebrow={secretariat.eyebrow}
            heading={secretariat.heading}
            description={secretariat.description}
            accent="blue"
            accentClass="text-brand"
          />
        </div>

        {secretariat.groups.map((g) => (
          <Group key={g.label} group={g} />
        ))}
      </div>
    </section>
  );
}
