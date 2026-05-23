import type { CaseSlug } from "./personas";

/**
 * Sprint 3 — The Narrator.
 *
 * Copy for Chitra's behavioral nudges, kept apart from the sensing logic so it
 * reads like a script. Tone follows the Chitra spec: calm, two sentences max,
 * no emoji, always a path forward.
 */

export const DWELL_NUDGE = {
  tag: "you've been here a while",
  msg: "You're spending time here. Want the 30-second version or the strategic context?",
  short: "30-second version",
  strategic: "Strategic context",
};

export const FOOTER_NUDGE = {
  tag: "before you go",
  msg: "Before you go — what would have made this more useful? I'll pass it to Anupam.",
  primary: "Leave a note",
  secondary: "No thanks",
};

export const RETURN_NUDGE = {
  tag: "back to this one",
  msg: "Want me to compare this with another project?",
  primary: "Compare",
  secondary: "Just browsing",
};

/**
 * The inline TL;DR shown inside the dwell nudge. `short` is the 30-second read;
 * `strategic` is the why-it-mattered. Tuned to fit the pill — two lines each.
 */
export const CASE_TLDR: Record<
  CaseSlug,
  { short: string; strategic: string }
> = {
  "dfd-divya": {
    short:
      "Divya is an AI devotional companion where the interface is the agent — it reads ritual context and reshapes around what's being practiced. 180k MAU, 92% 30-day retention.",
    strategic:
      "It proves Anupam can ship AI-native product where the model is the material, not a feature bolted on. The interface, not the model, is what users credit.",
  },
  "ibm-power-hmc": {
    short:
      "A hardware management console for IBM Power, rebuilt from a desktop client into a modern web surface used across the platform.",
    strategic:
      "Enterprise at platform scale: simplifying a deep, mission-critical system without breaking the operators who depend on it daily.",
  },
  "bt-business-billing": {
    short:
      "A redesign of BT's SME business billing — a multi-decade legacy system — that cut the most common support tickets.",
    strategic:
      "Shows the discipline of modernizing legacy enterprise UX incrementally, measured by support-load reduction rather than visual polish.",
  },
  "intent-first-ux": {
    short:
      "IFU is Anupam's four-stage spine for AI interfaces: Sense, Morph, Confirm, Escape. This portfolio runs on it.",
    strategic:
      "It's the method behind the work — a repeatable model for any product where the interface itself behaves, not just a single project.",
  },
  "gravity-spatial-ui": {
    short:
      "GRAVITY is a four-plane model — Ground, Ring, Atmosphere, Voice — for designing agents that live outside 2D rectangles.",
    strategic:
      "It's how Anupam approaches voice, AR, and embodied AI: spatial-first thinking for products that don't fit a screen.",
  },
  "panchang-engine": {
    short:
      "A generative Vedic almanac computing 60,000 ritual events a year. It powers Divya and now two third-party products via API.",
    strategic:
      "Ritual-grade generative systems: the quiet data engine other products depend on, designed to feel inevitable rather than computed.",
  },
};
