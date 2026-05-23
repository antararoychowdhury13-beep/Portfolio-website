"use client";

import type { PersonaId } from "./personas";

export type IntentToken = "role" | "problem" | "curiosity" | "skip";

const STORAGE_KEY = "intent.v1";

export interface IntentChoice {
  intent: IntentToken;
  persona: PersonaId;
  at: number;
}

export const INTENT_LABELS: Record<IntentToken, { label: string; sub: string }> = {
  role: {
    label: "A role to fill",
    sub: "Hiring a senior or director-level designer.",
  },
  problem: {
    label: "A product problem",
    sub: "Founder or PM with a real product to ship.",
  },
  curiosity: {
    label: "Just curious",
    sub: "Designer or student — here for the craft.",
  },
  skip: {
    label: "Show me everything",
    sub: "Skip the question — browse the full portfolio.",
  },
};

export const WHY_BLURB: Record<PersonaId, string> = {
  "recruiter-ai-lab":
    "You signaled an AI-lab hiring intent, so the three cases that prove the thesis are now at the top.",
  "enterprise-hiring":
    "You said you have a role to fill — leadership and platform cases moved up; frameworks follow.",
  founder:
    "You said you have a product problem — generative and AI-native cases moved up first.",
  "peer-designer":
    "You said you're here out of curiosity — the frameworks and craft-heavy cases moved up.",
  unknown:
    "Default order — no signal collected, you're seeing the full portfolio as-is.",
};

/**
 * Maps the visitor's tapped intent to one of the existing personas.
 * If the referrer already hinted at a specific persona (e.g. an AI-lab
 * recruiter), `role` upgrades from generic enterprise-hiring to the
 * referrer's nuance — best-of-both.
 */
export function intentToPersona(
  intent: IntentToken,
  referrerHint: PersonaId | null,
): PersonaId {
  switch (intent) {
    case "role":
      if (referrerHint === "recruiter-ai-lab") return "recruiter-ai-lab";
      return "enterprise-hiring";
    case "problem":
      return "founder";
    case "curiosity":
      return "peer-designer";
    case "skip":
      return "unknown";
  }
}

export function loadIntent(): IntentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as IntentChoice;
    if (!parsed.intent || !parsed.persona) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveIntent(choice: IntentChoice): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
  } catch {
    /* ignore — private mode, quota, etc. */
  }
}

export function clearIntent(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
