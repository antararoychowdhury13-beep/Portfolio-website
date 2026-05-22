import type { CaseSlug } from "./personas";

export interface CaseSummary {
  slug: CaseSlug;
  tag: string;
  year: string;
  title: string;
  titleAccent: string;
  description: string;
  pills: string[];
}

export const CASES: Record<CaseSlug, CaseSummary> = {
  "dfd-divya": {
    slug: "dfd-divya",
    tag: "AI-native · agent",
    year: "2026",
    title: "Divya — an interface that observes",
    titleAccent: "observes",
    description:
      "A sovereign devotional companion built on Claude. The interface is the agent: it senses context, narrates intent, and reshapes the surface around the ritual it is hosting.",
    pills: ["Claude", "Tool-use", "Devotional UX", "Voice"],
  },
  "ibm-power-hmc": {
    slug: "ibm-power-hmc",
    tag: "Enterprise · platform",
    year: "2022",
    title: "IBM Power HMC — a console for a fleet",
    titleAccent: "fleet",
    description:
      "Redesigned the Hardware Management Console serving 30k+ enterprise admins. Cut task time on the top five flows by 41% without retraining a single operator.",
    pills: ["Design systems", "Platform UX", "z/OS"],
  },
  "bt-business-billing": {
    slug: "bt-business-billing",
    tag: "Consumer · billing",
    year: "2023",
    title: "BT Business — billing that explains itself",
    titleAccent: "explains",
    description:
      "A self-service billing surface for 1.2M SMB accounts. Replaced a 14-page invoice with a single living statement that answers the next question before it is asked.",
    pills: ["Billing", "Consumer", "GDS"],
  },
  "intent-first-ux": {
    slug: "intent-first-ux",
    tag: "Framework · IFU",
    year: "2025",
    title: "Intent-First UX — the framework I use to design AI",
    titleAccent: "framework",
    description:
      "A four-stage model — Sense, Morph, Confirm, Escape — that gives AI interfaces a spine. Used at Cohere, Druid, and inside two unannounced agent products.",
    pills: ["Framework", "AI", "Method"],
  },
  "gravity-spatial-ui": {
    slug: "gravity-spatial-ui",
    tag: "Framework · GRAVITY",
    year: "2025",
    title: "GRAVITY — spatial UI for embodied AI",
    titleAccent: "spatial",
    description:
      "A four-plane model for spatial computing. Used to ship two visionOS prototypes and to argue, in public, that agents do not belong in 2D rectangles.",
    pills: ["Spatial", "visionOS", "Framework"],
  },
  "panchang-engine": {
    slug: "panchang-engine",
    tag: "Consumer · culture",
    year: "2024",
    title: "Panchang Engine — a calendar that breathes",
    titleAccent: "breathes",
    description:
      "A generative Vedic almanac that computes 60k events a year and surfaces the right one to the right user, on the right day. Live in DFD; 180k devotees this month.",
    pills: ["Generative", "Culture", "Algorithm"],
  },
};

export const ALL_SLUGS: CaseSlug[] = [
  "dfd-divya",
  "ibm-power-hmc",
  "bt-business-billing",
  "intent-first-ux",
  "gravity-spatial-ui",
  "panchang-engine",
];

export const FILTER_MAP: Record<string, CaseSlug[]> = {
  Everything: ALL_SLUGS,
  "AI-native": ["dfd-divya", "intent-first-ux", "panchang-engine"],
  Enterprise: ["ibm-power-hmc", "bt-business-billing"],
  Consumer: ["bt-business-billing", "panchang-engine"],
  Leadership: ["ibm-power-hmc", "intent-first-ux", "gravity-spatial-ui"],
};
