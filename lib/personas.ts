export type PersonaId =
  | "recruiter-ai-lab"
  | "enterprise-hiring"
  | "founder"
  | "peer-designer"
  | "unknown";

export type CaseSlug =
  | "dfd-divya"
  | "ibm-power-hmc"
  | "siemens-workforce-transformation"
  | "bt-business-billing"
  | "intent-first-ux"
  | "gravity-spatial-ui"
  | "panchang-engine";

export interface Persona {
  id: PersonaId;
  contextLabel: string;
  heroVerb: string;
  surfaceOrder: CaseSlug[];
  surfaceCount: number;
  overlayPrimary: string;
  overlaySecondary: string;
  overlayMessage: string;
}

export const PERSONAS: Record<PersonaId, Persona> = {
  "recruiter-ai-lab": {
    id: "recruiter-ai-lab",
    contextLabel: "Recruiter · Anthropic",
    heroVerb: "intelligent",
    surfaceOrder: [
      "dfd-divya",
      "intent-first-ux",
      "gravity-spatial-ui",
      "panchang-engine",
      "ibm-power-hmc",
      "siemens-workforce-transformation",
      "bt-business-billing",
    ],
    surfaceCount: 3,
    overlayPrimary: "Book 15 min with Anupam",
    overlaySecondary: "Send me his AI deck",
    overlayMessage:
      "You came from an AI lab. The work that proves the thesis is the three cases now at the top.",
  },
  "enterprise-hiring": {
    id: "enterprise-hiring",
    contextLabel: "Enterprise hiring · director-level",
    heroVerb: "scalable",
    surfaceOrder: [
      "ibm-power-hmc",
      "siemens-workforce-transformation",
      "bt-business-billing",
      "intent-first-ux",
      "gravity-spatial-ui",
      "dfd-divya",
      "panchang-engine",
    ],
    surfaceCount: 3,
    overlayPrimary: "Book a 30-min intro",
    overlaySecondary: "Download enterprise case deck",
    overlayMessage:
      "Director-level enterprise context detected. Surfacing the platform work — IBM, BT, and the IFU framework.",
  },
  founder: {
    id: "founder",
    contextLabel: "Founder · AI product",
    heroVerb: "alive",
    surfaceOrder: [
      "dfd-divya",
      "gravity-spatial-ui",
      "panchang-engine",
      "intent-first-ux",
      "ibm-power-hmc",
      "siemens-workforce-transformation",
      "bt-business-billing",
    ],
    surfaceCount: 3,
    overlayPrimary: "Book an exploratory call",
    overlaySecondary: "See the Divya architecture",
    overlayMessage:
      "Founder context. Reordering toward generative, embodied, and ritual-grade work.",
  },
  "peer-designer": {
    id: "peer-designer",
    contextLabel: "Peer designer · craft view",
    heroVerb: "crafted",
    surfaceOrder: [
      "intent-first-ux",
      "gravity-spatial-ui",
      "dfd-divya",
      "siemens-workforce-transformation",
      "ibm-power-hmc",
      "panchang-engine",
      "bt-business-billing",
    ],
    surfaceCount: 3,
    overlayPrimary: "Read the IFU framework",
    overlaySecondary: "Skip — I'll browse",
    overlayMessage:
      "Peer-designer context. The frameworks and the case studies that show method are at the top.",
  },
  unknown: {
    id: "unknown",
    contextLabel: "Welcome — observing",
    heroVerb: "intelligent",
    surfaceOrder: [
      "dfd-divya",
      "ibm-power-hmc",
      "siemens-workforce-transformation",
      "bt-business-billing",
      "intent-first-ux",
      "gravity-spatial-ui",
      "panchang-engine",
    ],
    surfaceCount: 0,
    overlayPrimary: "Book a call",
    overlaySecondary: "Browse",
    overlayMessage: "Observing.",
  },
};

const REFERRER_MAP: Array<[RegExp, PersonaId]> = [
  [/anthropic\.com|openai\.com|cohere\.com|x\.ai|mistral\.ai|deepmind/i, "recruiter-ai-lab"],
  [/ibm\.com|sap\.com|atlassian\.com|servicenow\.com|gitlab\.com|oracle\.com/i, "enterprise-hiring"],
  [/ycombinator\.com|producthunt\.com|news\.ycombinator/i, "founder"],
  [/dribbble\.com|behance\.net|read\.cv|are\.na|layers\.to/i, "peer-designer"],
];

export function detectPersona(opts: {
  referrer?: string;
  search?: string;
}): PersonaId {
  const search = opts.search ?? "";
  const params = new URLSearchParams(search);
  const explicit = params.get("persona") as PersonaId | null;
  if (explicit && explicit in PERSONAS) return explicit;

  const via = params.get("via")?.toLowerCase();
  if (via) {
    if (["anthropic", "openai", "cohere", "ailab"].includes(via)) return "recruiter-ai-lab";
    if (["ibm", "sap", "enterprise"].includes(via)) return "enterprise-hiring";
    if (["yc", "ycombinator", "founder"].includes(via)) return "founder";
    if (["dribbble", "behance", "designer"].includes(via)) return "peer-designer";
  }

  const referrer = opts.referrer ?? "";
  if (referrer) {
    for (const [pattern, id] of REFERRER_MAP) {
      if (pattern.test(referrer)) return id;
    }
  }

  return "unknown";
}
