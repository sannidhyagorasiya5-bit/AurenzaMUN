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
  { label: "COUNTDOWN", href: "#countdown" },
  { label: "COMMITTEES", href: "#committees" },
  { label: "REGISTER", href: "#register" },
  { label: "TEAM", href: "#crew" },
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
    { value: 13, label: "COMMITTEES" },
    { value: 2, label: "DAYS OF DEBATE" },
    { value: 400, label: "DELEGATES", suffix: "+" },
  ],
  floatingCards: [
    { label: "DATE", value: "Oct 10 to 11, 2026" },
    { label: "VENUE", value: "SVIS Kandivali, Mumbai" },
  ],
  marquee: [
    "13 COMMITTEES",
    "2 DAYS OF DEBATE",
    "SVIS KANDIVALI",
    "MODEL UNITED NATIONS",
    "MUMBAI 2026",
  ],
} as const;

export type Committee = {
  abbr: string;
  name: string;
  /** One entry per agenda — a few committees run more than one. */
  agenda: readonly string[];
  description: string;
  /** Rendered as the two-column "KEY FOCUS AREAS" list. */
  focus: string[];
  /** Heading for the second tab — "NATIONS", "CHARACTERS", "PORTFOLIOS"... */
  portfolioLabel?: string;
  /** Omit (or leave empty) and the second tab is hidden entirely. */
  portfolios?: string[];
};

export type Track = {
  id: "school" | "college" | "ip";
  tab: string;
  accent: Accent;
  committees: Committee[];
  emptyState?: string;
};

/**
 * DRAFT COPY — the descriptions, focus areas and portfolio slates below were
 * written as a starting point and are NOT confirmed by the secretariat.
 * The agendas themselves are confirmed. Trim each slate to the seats actually being allotted,
 * and delete `portfolios` on any committee whose matrix is not public yet
 * (the second tab hides itself when the list is missing).
 */
export const committees = {
  eyebrow: "13 COMMITTEES · 3 TRACKS",
  heading: ["CHOOSE YOUR", "COMMITTEE"] as [string, string],
  description:
    "Agendas are live. Select a track to explore the committees available for delegation.",
  note: "Tap any committee for its agenda, focus areas and portfolio matrix.",
  portfolioNote: "Portfolios are subject to availability at the time of registration.",
  tracks: [
    {
      id: "school",
      tab: "School Committees",
      accent: "blue",
      committees: [
        {
          abbr: "MARVEL",
          name: "Marvel Crisis Committee",
          agenda: ["The rise of Doctor Doom and the threats to global security."],
          description:
            "A fast-moving crisis committee set in the Marvel universe. Delegates take on the powers, allegiances and grudges of iconic heroes and villains while an escalating threat forces the room to negotiate under pressure.",
          focus: [
            "Respond to crisis updates in real time",
            "Balance personal agendas against a common threat",
            "Negotiate alliances across hero and villain lines",
            "Weigh collateral damage against decisive action",
          ],
          portfolioLabel: "CHARACTERS",
          portfolios: [
            "Iron Man", "Captain America", "Thor", "Black Widow", "Hulk", "Hawkeye",
            "Doctor Strange", "Scarlet Witch", "Vision", "Spider-Man", "Black Panther",
            "Shuri", "Okoye", "Nick Fury", "Captain Marvel", "Ant-Man", "Wasp",
            "Falcon", "Winter Soldier", "Star-Lord", "Gamora", "Rocket Raccoon",
            "Groot", "Wolverine", "Professor X", "Magneto", "Storm", "Daredevil",
            "Loki", "Thanos", "Ultron", "Doctor Doom",
          ],
        },
        {
          abbr: "AIPPM",
          name: "All India Political Parties Meet",
          agenda: [
            "Should criminals holding severe crimes still be allowed to contest for elections?",
            "Electoral and political reforms in India: strengthening political funding transparency, electoral accountability and the integrity of the democratic process.",
          ],
          description:
            "The All India Political Parties Meet puts leaders from across the political spectrum in one room. Delegates argue as sitting politicians, defending a party line in public while searching for a consensus the country can actually live with.",
          focus: [
            "Argue from a real party position",
            "Build cross-party consensus on contested reform",
            "Handle press scrutiny and public opinion",
            "Separate electoral posturing from policy",
          ],
          portfolioLabel: "PORTFOLIOS",
          portfolios: [
            "Narendra Modi", "Amit Shah", "Rajnath Singh", "Nirmala Sitharaman",
            "Nitin Gadkari", "S. Jaishankar", "J.P. Nadda", "Yogi Adityanath",
            "Devendra Fadnavis", "Himanta Biswa Sarma", "Rahul Gandhi",
            "Mallikarjun Kharge", "Sonia Gandhi", "Priyanka Gandhi Vadra",
            "P. Chidambaram", "Shashi Tharoor", "Arvind Kejriwal", "Mamata Banerjee",
            "M.K. Stalin", "Sharad Pawar", "Supriya Sule", "Uddhav Thackeray",
            "Eknath Shinde", "Akhilesh Yadav", "Tejashwi Yadav", "Nitish Kumar",
            "Asaduddin Owaisi", "Chandrababu Naidu", "K. Chandrashekar Rao",
            "Hemant Soren", "Omar Abdullah", "Mehbooba Mufti", "Naveen Patnaik",
            "Pinarayi Vijayan", "Kanimozhi", "D. Raja",
          ],
        },
        {
          abbr: "UNSC",
          name: "United Nations Security Council",
          agenda: [
            "The accountability stances of countries acting in active conflict zones when ISIL/Da’esh and other terrorist organizations pose serious threats.",
          ],
          description:
            "The Security Council carries primary responsibility for international peace and security. Fifteen members debate under the shadow of the veto, where a single vote decides whether the Council acts at all.",
          focus: [
            "Draft resolutions that can survive the veto",
            "Balance sovereignty against intervention",
            "Authorise peacekeeping and sanctions regimes",
            "Respond to crisis updates from the field",
          ],
          portfolioLabel: "NATIONS",
          portfolios: [
            "China", "France", "Russian Federation", "United Kingdom", "United States",
            "Algeria", "Denmark", "Greece", "Guyana", "Pakistan", "Panama",
            "Republic of Korea", "Sierra Leone", "Slovenia", "Somalia",
          ],
        },
        {
          abbr: "WHO",
          name: "World Health Organization",
          agenda: [
            "Preventing the misuse of high-risk pathogens as bioweapons, while still allowing research.",
          ],
          description:
            "The World Health Organization convenes member states on global health. Delegates negotiate the financing, equity and emergency machinery that decide how the world responds when the next outbreak crosses a border.",
          focus: [
            "Strengthen pandemic preparedness and response",
            "Close the gap in vaccine and medicine access",
            "Fund health systems in developing states",
            "Balance sovereignty with global reporting duties",
          ],
          portfolioLabel: "NATIONS",
          portfolios: [
            "India", "United States", "China", "Brazil", "South Africa", "Nigeria",
            "Kenya", "Ethiopia", "Egypt", "Democratic Republic of the Congo",
            "United Kingdom", "France", "Germany", "Italy", "Spain", "Netherlands",
            "Sweden", "Norway", "Switzerland", "Russian Federation", "Ukraine",
            "Poland", "Türkiye", "Saudi Arabia", "United Arab Emirates",
            "Islamic Republic of Iran", "Israel", "Pakistan", "Bangladesh",
            "Sri Lanka", "Nepal", "Indonesia", "Malaysia", "Thailand", "Viet Nam",
            "Philippines", "Japan", "Republic of Korea", "Australia", "New Zealand",
            "Canada", "Mexico", "Argentina", "Chile", "Colombia", "Peru", "Cuba",
          ],
        },
        {
          abbr: "NEETI AAYOG",
          name: "National Institution for Transforming India",
          agenda: [
            "Transforming Indian agriculture digitally via AI and other factors, while keeping sustainability concerns in mind.",
          ],
          description:
            "NITI Aayog is the policy think tank of the Union government. Its Governing Council seats the Prime Minister, Union ministers and every Chief Minister, making it the room where national targets meet state realities.",
          focus: [
            "Reconcile centre and state fiscal priorities",
            "Design measurable development targets",
            "Weigh growth against sustainability",
            "Translate policy into implementable schemes",
          ],
          portfolioLabel: "PORTFOLIOS",
          portfolios: [
            "Prime Minister (Chairperson)", "Vice Chairperson, NITI Aayog",
            "Chief Executive Officer, NITI Aayog", "Union Home Minister",
            "Union Finance Minister", "Union Minister of Agriculture",
            "Union Minister of Education", "Union Minister of Health & Family Welfare",
            "Union Minister of Road Transport & Highways",
            "Union Minister of Commerce & Industry",
            "Union Minister of Environment, Forest & Climate Change",
            "Chief Minister — Maharashtra", "Chief Minister — Uttar Pradesh",
            "Chief Minister — Gujarat", "Chief Minister — Tamil Nadu",
            "Chief Minister — Karnataka", "Chief Minister — West Bengal",
            "Chief Minister — Rajasthan", "Chief Minister — Madhya Pradesh",
            "Chief Minister — Bihar", "Chief Minister — Kerala",
            "Chief Minister — Punjab", "Chief Minister — Telangana",
            "Chief Minister — Andhra Pradesh", "Chief Minister — Odisha",
            "Chief Minister — Assam", "Chief Minister — Haryana",
            "Chief Minister — Jharkhand", "Chief Minister — Chhattisgarh",
            "Chief Minister — Uttarakhand", "Chief Minister — Himachal Pradesh",
            "Chief Minister — Goa", "Chief Minister — NCT of Delhi",
          ],
        },
        {
          abbr: "MAHABHARATA",
          name: "A committee set on Mahabharata.",
          agenda: [
            "The Kurukshetra crisis: preventing, reshaping or waging the Great War — political alliances, succession, diplomacy and the fate of Hastinapura.",
          ],
          description:
            "Set in the Sabha of Hastinapura on the edge of the Kurukshetra war. Delegates embody the characters of the epic and argue dharma against ambition, kinship against justice, with the fate of a kingdom on the table.",
          focus: [
            "Embody a character and its contradictions",
            "Weigh kinship against justice",
            "Negotiate the terms of war and peace",
            "Defend a claim to the throne of Hastinapura",
          ],
          portfolioLabel: "CHARACTERS",
          portfolios: [
            "Krishna", "Yudhishthira", "Bhima", "Arjuna", "Nakula", "Sahadeva",
            "Draupadi", "Kunti", "Gandhari", "Dhritarashtra", "Duryodhana",
            "Dushasana", "Shakuni", "Karna", "Bhishma", "Dronacharya", "Kripacharya",
            "Ashwatthama", "Vidura", "Abhimanyu", "Ghatotkacha", "Subhadra",
            "Satyavati", "Shantanu", "Jayadratha", "Shalya", "Virata", "Uttara",
            "Uttar", "Dushala", "Yuyutsu", "Keechaka", "Madri", "Ambika",
            "Jarasandha", "Shishupala", "Sanjaya", "Balarama", "Drupada",
            "Dhrishtadyumna", "Shikhandi", "Indra Dev",
          ],
        },
      ],
    },
    {
      id: "college",
      tab: "College Committees",
      accent: "gold",
      committees: [
        {
          abbr: "LOK SABHA",
          name: "House of the People",
          agenda: [
            "Maintaining accountability and responsibility for national entrance examinations such as NEET.",
          ],
          description:
            "The House of the People, where the government of the day must defend its bills on the floor. Delegates sit as Members of Parliament and use motions, questions and division of the House to make or break legislation.",
          focus: [
            "Master parliamentary rules of procedure",
            "Defend or dismantle a bill clause by clause",
            "Use questions, motions and adjournments",
            "Represent a constituency, not just a party",
          ],
          portfolioLabel: "PORTFOLIOS",
          portfolios: [
            "Speaker of the Lok Sabha", "Deputy Speaker", "Prime Minister",
            "Leader of the House", "Leader of the Opposition",
            "Minister of Home Affairs", "Minister of Finance", "Minister of Defence",
            "Minister of External Affairs", "Minister of Law & Justice",
            "Minister of Parliamentary Affairs", "Minister of Agriculture",
            "Minister of Education", "Minister of Health & Family Welfare",
            "Minister of Railways", "Minister of Commerce & Industry",
            "MP — Bharatiya Janata Party", "MP — Indian National Congress",
            "MP — Samajwadi Party", "MP — All India Trinamool Congress",
            "MP — Dravida Munnetra Kazhagam", "MP — Telugu Desam Party",
            "MP — Janata Dal (United)", "MP — Shiv Sena",
            "MP — Nationalist Congress Party", "MP — Rashtriya Janata Dal",
            "MP — Communist Party of India (Marxist)",
            "MP — Aam Aadmi Party", "MP — YSR Congress Party",
            "MP — Biju Janata Dal", "MP — AIMIM", "MP — Independent",
          ],
        },
        {
          abbr: "RAJYA SABHA",
          name: "Council of States",
          agenda: [
            "Reviewing AI-generated political content while still protecting freedom of speech.",
          ],
          description:
            "The Council of States reviews what the Lok Sabha passes and speaks for the states within the Union. Debate here is slower and more technical, and it is often where a bill is actually reshaped.",
          focus: [
            "Scrutinise legislation clause by clause",
            "Represent state interests in the Union",
            "Use the rulings of the Chair and points of order",
            "Build cross-party support for amendments",
          ],
          portfolioLabel: "PORTFOLIOS",
          portfolios: [
            "Chairman of the Rajya Sabha", "Deputy Chairman", "Leader of the House",
            "Leader of the Opposition", "Minister of Finance",
            "Minister of Home Affairs", "Minister of External Affairs",
            "Minister of Law & Justice", "Minister of Parliamentary Affairs",
            "Minister of Information & Broadcasting",
            "MP — Maharashtra", "MP — Uttar Pradesh", "MP — Tamil Nadu",
            "MP — West Bengal", "MP — Karnataka", "MP — Gujarat",
            "MP — Bihar", "MP — Rajasthan", "MP — Madhya Pradesh",
            "MP — Andhra Pradesh", "MP — Telangana", "MP — Kerala",
            "MP — Punjab", "MP — Odisha", "MP — Assam",
            "MP — Jharkhand", "MP — Chhattisgarh", "MP — Haryana",
            "MP — Delhi", "MP — Nominated Member",
          ],
        },
        {
          abbr: "BRICS SUMMIT",
          name: "BRICS Summit",
          agenda: [
            "Determining the role of BRICS in de-escalating conflicts in West Asia, and promoting international peace and security.",
          ],
          description:
            "A summit of major emerging economies coordinating on trade, finance and a multipolar order. Heads of delegation negotiate outside the established financial architecture, with currencies, development banks and energy on one table.",
          focus: [
            "Coordinate trade and currency settlement",
            "Fund development without external conditionality",
            "Balance member rivalries inside the bloc",
            "Position the bloc against G7 policy",
          ],
          portfolioLabel: "NATIONS",
          portfolios: [
            "Brazil", "Russian Federation", "India", "China", "South Africa",
            "Egypt", "Ethiopia", "Islamic Republic of Iran", "United Arab Emirates",
            "Indonesia", "Saudi Arabia", "Argentina", "Nigeria", "Türkiye",
            "Viet Nam", "Malaysia", "Thailand", "Kazakhstan", "Uganda", "Cuba",
            "Bolivia", "Belarus", "Algeria", "Bangladesh",
          ],
        },
        {
          abbr: "INDIAN WAR CABINET",
          name: "Indian War Cabinet",
          agenda: [
            "Resolving the political deadlock between the Indian National Congress and the All-India Muslim League over India’s constitutional future during wartime.",
          ],
          description:
            "A closed-door crisis cabinet convened as a national security emergency unfolds. Delegates hold political, military and intelligence portfolios, and every directive they pass has consequences the next update reports back.",
          focus: [
            "Issue directives on incomplete intelligence",
            "Balance military options against diplomatic cost",
            "Manage escalation and the nuclear threshold",
            "Control the public and press narrative",
          ],
          portfolioLabel: "PORTFOLIOS",
          portfolios: [
            "Prime Minister", "Minister of Defence", "Minister of Home Affairs",
            "Minister of External Affairs", "Minister of Finance",
            "National Security Adviser", "Chief of Defence Staff",
            "Chief of the Army Staff", "Chief of the Naval Staff",
            "Chief of the Air Staff", "Director General of Military Operations",
            "Chief of Integrated Defence Staff", "Director — Intelligence Bureau",
            "Secretary — Research & Analysis Wing", "Cabinet Secretary",
            "Defence Secretary", "Foreign Secretary", "Home Secretary",
            "Principal Secretary to the Prime Minister",
            "Director General — Border Security Force",
            "Chairman — DRDO", "Chairman — ISRO",
          ],
        },
        {
          abbr: "UNHRC",
          name: "United Nations Human Rights Council",
          agenda: [
            "Ensuring accountability for human rights violations during the suppression of protests, and protecting fundamental freedoms.",
          ],
          description:
            "The Human Rights Council investigates and reports on violations wherever they occur. Delegates negotiate resolutions that name states, mandate rapporteurs and test how far sovereignty shields a government from scrutiny.",
          focus: [
            "Investigate violations without politicising the mandate",
            "Balance sovereignty against accountability",
            "Protect civil society and human rights defenders",
            "Mandate special rapporteurs and inquiries",
          ],
          portfolioLabel: "NATIONS",
          portfolios: [
            "India", "United States", "China", "Russian Federation", "United Kingdom",
            "France", "Germany", "Belgium", "Netherlands", "Finland", "Romania",
            "Czechia", "Bulgaria", "Georgia", "Ukraine", "Switzerland", "Spain",
            "Portugal", "Greece", "Türkiye", "Qatar", "Kuwait",
            "United Arab Emirates", "Saudi Arabia", "Islamic Republic of Iran",
            "Israel", "Egypt", "Morocco", "Algeria", "Sudan", "South Africa",
            "Nigeria", "Ghana", "Kenya", "Ethiopia", "Rwanda", "Burundi", "Malawi",
            "Japan", "Republic of Korea", "Indonesia", "Malaysia", "Bangladesh",
            "Pakistan", "Maldives", "Viet Nam", "Australia", "Brazil", "Argentina",
            "Chile", "Colombia", "Mexico", "Cuba", "Venezuela",
          ],
        },
        {
          abbr: "C.C.C",
          name: "Continuous Crisis Committee",
          agenda: [
            "The new world order crisis: escalation of a multi-theatre global conflict and the prevention of a Third World War.",
            "The 72-hour countdown: preventing a global catastrophe amid simultaneous cyber, military, economic and diplomatic crises.",
          ],
          description:
            "A continuous crisis committee that never resets. Directives, updates and consequences carry forward across every session, so a decision taken in the first hour is still shaping the room on day two.",
          focus: [
            "React to updates as they break",
            "Write directives with clear, workable mandates",
            "Track consequences across sessions",
            "Coordinate covert and public strategy",
          ],
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
          agenda: ["Agenda to be announced"],
          description:
            "The International Press covers every committee at the conference. Delegates work as reporters, photographers and caricaturists, filing copy on debates as they happen and holding the floor to account.",
          focus: [
            "File accurate copy under deadline",
            "Interview delegates and chairs on the record",
            "Capture the conference in photograph and caricature",
            "Separate reporting from editorial opinion",
          ],
          portfolioLabel: "ROLES",
          portfolios: [
            "Editor-in-Chief", "Managing Editor", "Copy Editor",
            "Reporter — Print", "Reporter — Broadcast",
            "Photojournalist", "Caricaturist", "Social Media Correspondent",
          ],
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
  eyebrow: "LEADERSHIP",
  heading: ["MEET THE", "TEAM"] as [string, string],
  description:
    "AurenzaMUN is guided by a dedicated team committed to delivering an exceptional conference experience.",
  members: [
    {
      name: "Ruqaiyah Bharmal",
      role: "SECRETARY GENERAL",
      subtitle: "SECRETARY GENERAL · AURENZAMUN",
      bio: "Leading AurenzaMUN as Secretary General, Ruqaiyah brings vision, discipline, and diplomatic acumen to ensure a world-class conference experience for every delegate.",
    },
    {
      name: "Arnav Bohra",
      role: "DIRECTOR GENERAL",
      subtitle: "DIRECTOR GENERAL · AURENZAMUN",
      bio: "As Director General, Arnav ensures procedural excellence and equitable debate across all committees, supporting delegates in navigating rules of procedure.",
    },
  ],
  footnote: "More team members will be announced soon",
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
