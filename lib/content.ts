/**
 * AurenzaMUN — single source of truth for all site copy.
 * Extracted from info.md. Plain data only (no JSX) so it can be
 * imported by both Server and Client Components.
 */

export type Accent = "blue" | "gold" | "ice";

export const site = {
  wordmark: "AURENZAMUN",
  copyright: "© 2026 AurenzaMUN · SVIS Kandivali",
} as const;

export const nav = [
  { label: "COMMITTEES", href: "#committees" },
  { label: "REGISTER", href: "#register" },
  { label: "CREW", href: "#crew" },
  { label: "RESOURCES", href: "#resources" },
  { label: "CONTACT US", href: "#social" },
] as const;

export const hero = {
  badges: ["10 & 11 OCTOBER 2026", "SVIS KANDIVALI, MUMBAI"],
  venueMapUrl:
    "https://www.google.com/maps/place/Swami+Vivekanand+International+School,+Kandivali,+MG+Cross+Road+No.+1,+Kandivali,+Gokul+Nagari,+Kandivali+West,+Mumbai,+Maharashtra+400067/@19.2096745,72.8446805,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7b6d769be7cbb:0xe6a9f85dba3a9881!8m2!3d19.2096745!4d72.8472554!16s%2Fg%2F11bw417cc_?entry=ttu&g_ep=EgoyMDI2MDgxNi4wIKXMDSoASAFQAw%3D%3D",
  headline: ["AURENZA", "MUN"] as [string, string],
  subheadline:
    "A premier Model United Nations conference bringing together student diplomats from across Mumbai — debate, collaborate, and resolve the world's toughest challenges.",
  ctaPrimary: "REGISTER AS DELEGATE",
  ctaSecondary: "EXPLORE COMMITTEES",
  stats: [
    { value: 11, label: "COMMITTEES" },
    { value: 2, label: "DAYS OF DEBATE" },
    { value: 400, label: "DELEGATES", suffix: "+" },
  ],
  floatingCards: [
    { label: "DATE", value: "Oct 10 to 11, 2026" },
    { label: "VENUE", value: "SVIS Kandivali, Mumbai" },
  ],
  marquee: [
    "11 COMMITTEES",
    "2 DAYS OF DEBATE",
    "SVIS KANDIVALI",
    "MODEL UNITED NATIONS",
    "MUMBAI 2026",
  ],
} as const;

export type Committee = {
  abbr: string;
  name: string;
  agenda: string;
};

export type Track = {
  id: "school" | "college" | "ip";
  tab: string;
  accent: Accent;
  committees: Committee[];
  emptyState?: string;
};

export const committees = {
  eyebrow: "11 COMMITTEES · 3 TRACKS",
  heading: ["CHOOSE YOUR", "COMMITTEE"] as [string, string],
  description: "Click or tap the panels to reveal agendas.",
  tracks: [
    {
      id: "school",
      tab: "School Committees",
      accent: "blue",
      committees: [
        { abbr: "MARVEL", name: "Marvel Crisis Committee", agenda: "Agenda to be announced" },
        { abbr: "AIPPM", name: "All India Political Parties Meet", agenda: "Agenda to be announced" },
        { abbr: "UNSC", name: "United Nations Security Council", agenda: "Agenda to be announced" },
        { abbr: "WHO", name: "World Health Organization", agenda: "Agenda to be announced" },
        {
          abbr: "NEETI AAYOG",
          name: "National Institution for Transforming India",
          agenda: "Agenda to be announced",
        },
      ],
    },
    {
      id: "college",
      tab: "College Committees",
      accent: "gold",
      committees: [
        { abbr: "LOK SABHA", name: "House of the People", agenda: "Agenda to be announced" },
        { abbr: "RAJYA SABHA", name: "Council of States", agenda: "Agenda to be announced" },
        { abbr: "BRICK SUMMIT", name: "Brick Summit", agenda: "Agenda to be announced" },
        {
          abbr: "INDIAN WAR CABINET",
          name: "Indian War Cabinet",
          agenda: "Agenda to be announced",
        },
        {
          abbr: "UNHRC",
          name: "United Nations Human Rights Council",
          agenda: "Agenda to be announced",
        },
      ],
    },
    {
      id: "ip",
      tab: "IP Committee",
      accent: "ice",
      committees: [
        {
          abbr: "IP",
          name: "International Press · open to both school & college delegates",
          agenda: "Agenda to be announced",
        },
      ],
    },
  ] satisfies Track[],
} as const;

export const registration = {
  eyebrow: "DELEGATE REGISTRATION",
  heading: ["JOIN THE", "DEBATE"] as [string, string],
  description:
    "Registrations for AurenzaMUN are now open. Follow the steps below to secure your seat at the conference.",
  steps: [
    {
      index: "01",
      title: "Fill the Google Form",
      body: "Complete the delegate registration form with your personal details, school/college name, and committee preferences.",
    },
    {
      index: "02",
      title: "Choose Your Committees",
      body: "Rank your top 3 committee preferences. Allotments are made based on availability and experience level.",
    },
    {
      index: "03",
      title: "Await Confirmation",
      body: "You will receive an email confirmation with your committee allotment, delegate guide, and payment details.",
    },
    {
      index: "04",
      title: "Join AurenzaMUN!",
      body: "Arrive at SVIS Kandivali on 10th October ready to debate, collaborate, and represent your nation.",
    },
  ],
  card: {
    body: "The delegate registration form will be shared soon. Check back here for the direct link, or reach out to the secretariat for early access.",
    button: "Google Form Link — Coming Soon",
  },
  details: [
    { label: "Deadline", value: "Late September 2026" },
    { label: "Eligibility", value: "Open to school & college students" },
    { label: "Location", value: "SVIS Kandivali, Mumbai" },
  ],
} as const;

export const secretariat = {
  eyebrow: "LEADERSHIP TEAM",
  heading: ["MEET THE", "CREW"] as [string, string],
  description:
    "AurenzaMUN is guided by a dedicated crew committed to delivering an exceptional conference experience.",
  members: [
    {
      name: "Ruqaiyah Bharmal",
      role: "SECRETARY GENERAL",
      subtitle: "SECRETARY GENERAL · AURENZAMUN",
      bio: "Leading AurenzaMUN as Secretary General, Ruqaiyah brings vision, discipline, and diplomatic acumen to ensure a world-class conference experience for every delegate.",
    },
    {
      name: "Arnav Bohra",
      role: "CHAIRPERSON",
      subtitle: "CHAIRPERSON · AURENZAMUN",
      bio: "As Chairperson, Arnav ensures procedural excellence and equitable debate across all committees, supporting delegates in navigating rules of procedure.",
    },
    {
      name: "Sannidhya Gorasiya",
      role: "DEVELOPER",
      subtitle: "DEVELOPER · AURENZAMUN",
      bio: "Sannidhya designed and built the AurenzaMUN website, with hours of palm sweat and typing, bringing the site to life as you're reading this.",
    },
  ],
  footnote: "More crew members will be announced soon",
} as const;

export const resources = {
  eyebrow: "DELEGATE RESOURCES",
  heading: ["PREP FOR", "CONFERENCE"] as [string, string],
  description:
    "All resources, study guides, and official documents will be uploaded here before the conference. Bookmark this page and check back regularly for updates.",
  statusBadge: "Resources uploading before October 2026",
  cards: [
    {
      title: "Delegate Study Guide",
      tag: "ALL DELEGATES",
      description:
        "Comprehensive guide covering research methodology, position paper writing, and committee preparation strategies for all tracks.",
      state: "Coming Soon",
    },
    {
      title: "Rules of Procedure",
      tag: "REQUIRED READING",
      description:
        "The official AurenzaMUN Rules of Procedure document governing all committee sessions, motions, and voting procedures.",
      state: "Coming Soon",
    },
    {
      title: "IP Press Guidelines",
      tag: "IP COMMITTEE",
      description:
        "Specific guidelines for International Press delegates covering article formats, reporting standards, and press conference etiquette.",
      state: "Coming Soon",
    },
  ],
  closing: "Resources will be made available ahead of the conference. Stay tuned for updates.",
} as const;

export const social = {
  eyebrow: "STAY CONNECTED",
  heading: ["FOLLOW", "AURENZAMUN"] as [string, string],
  description:
    "Follow along for committee announcements, delegate spotlights, and behind-the-scenes updates as we build toward October 2026.",
  platforms: [
    {
      name: "Instagram",
      handle: "@AurenzaMUN",
      href: "https://www.instagram.com/aurenzamun/",
      cta: "Follow on Instagram",
      external: true,
    },
    {
      name: "YouTube",
      handle: "@AurenzaMUN2026",
      href: "https://www.youtube.com/@AurenzaMUN2026",
      cta: "Follow on YouTube",
      external: true,
    },
    {
      name: "Mail Us",
      handle: "aurenzamun26@gmail.com",
      href: "mailto:aurenzamun26@gmail.com",
      cta: "Email us directly",
      external: false,
    },
  ],
} as const;
