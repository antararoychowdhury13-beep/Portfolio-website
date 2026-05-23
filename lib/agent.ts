"use client";

import { PERSONAS, type PersonaId, type CaseSlug } from "./personas";
import {
  intentToPersona,
  loadIntent,
  saveIntent,
  type IntentToken,
} from "./intent";

export type AgentState = "idle" | "observing" | "deciding" | "acting";
export type LogKind = "init" | "observe" | "reason" | "act" | "standby";

export interface LogEntry {
  id: string;
  t: number; // ms since session start
  kind: LogKind;
  text: string;
}

export interface OverlayContent {
  open: boolean;
  ctx: string;
  msg: string;
  primary: string;
  secondary: string;
}

export type NudgeKind = "dwell" | "footer" | "return" | "";

export interface NudgeState {
  open: boolean;
  id: string;
  kind: NudgeKind;
  tag: string;
  msg: string;
  slug?: CaseSlug;
}

const MAX_NUDGES_PER_SESSION = 3;

export interface AgentSnapshot {
  state: AgentState;
  log: LogEntry[];
  persona: PersonaId;
  heroVerb: string;
  contextLabel: string;
  surfacedOrder: CaseSlug[];
  surfacedSet: Set<CaseSlug>;
  overlay: OverlayContent;
  calendarOpen: boolean;
  dismissedThisSession: boolean;
  intent: IntentToken | null;
  intentTaken: boolean;
  referrerHint: PersonaId | null;
  nudge: NudgeState;
  hasActed: boolean;
}

type Listener = (s: AgentSnapshot) => void;

class Agent {
  private state: AgentState = "idle";
  private log: LogEntry[] = [];
  private persona: PersonaId = "unknown";
  private surfacedOrder: CaseSlug[] = PERSONAS.unknown.surfaceOrder;
  private surfacedSet: Set<CaseSlug> = new Set();
  private overlay: OverlayContent = {
    open: false,
    ctx: "",
    msg: "",
    primary: "",
    secondary: "",
  };
  private calendarOpen = false;
  private dismissedThisSession = false;
  private intent: IntentToken | null = null;
  private intentTaken = false;
  private referrerHint: PersonaId | null = null;
  private nudge: NudgeState = { open: false, id: "", kind: "", tag: "", msg: "" };
  private hasActed = false;
  private firedNudges = new Set<string>();
  private nudgeCount = 0;
  private listeners = new Set<Listener>();
  private start = Date.now();
  private running = false;
  private logCounter = 0;

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.snapshot());
    return () => {
      this.listeners.delete(fn);
    };
  }

  snapshot(): AgentSnapshot {
    const p = PERSONAS[this.persona];
    return {
      state: this.state,
      log: [...this.log],
      persona: this.persona,
      heroVerb: p.heroVerb,
      contextLabel: p.contextLabel,
      surfacedOrder: [...this.surfacedOrder],
      surfacedSet: new Set(this.surfacedSet),
      overlay: { ...this.overlay },
      calendarOpen: this.calendarOpen,
      dismissedThisSession: this.dismissedThisSession,
      intent: this.intent,
      intentTaken: this.intentTaken,
      referrerHint: this.referrerHint,
      nudge: { ...this.nudge },
      hasActed: this.hasActed,
    };
  }

  private emit() {
    const snap = this.snapshot();
    for (const fn of this.listeners) fn(snap);
  }

  private push(kind: LogKind, text: string) {
    this.logCounter += 1;
    this.log.push({
      id: `e${this.logCounter}`,
      t: Date.now() - this.start,
      kind,
      text,
    });
    if (this.log.length > 80) this.log = this.log.slice(-80);
    this.emit();
  }

  private setState(s: AgentState) {
    this.state = s;
    this.emit();
  }

  private wait(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
  }

  init() {
    if (this.log.length === 0) {
      this.push("init", "agent online — observing the surface.");
    }
    // Rehydrate intent from the same session so returners don't see
    // the question twice and the morph stays applied.
    if (!this.intentTaken) {
      const stored = loadIntent();
      if (stored) {
        this.intent = stored.intent;
        this.intentTaken = true;
        if (stored.persona !== "unknown") {
          this.persona = stored.persona;
          this.surfacedOrder = [...PERSONAS[stored.persona].surfaceOrder];
          this.surfacedSet = new Set(
            PERSONAS[stored.persona].surfaceOrder.slice(
              0,
              PERSONAS[stored.persona].surfaceCount,
            ),
          );
        }
        this.emit();
      }
    }
  }

  setReferrerHint(persona: PersonaId) {
    if (persona === "unknown") return;
    this.referrerHint = persona;
    this.push("observe", `referrer hint — ${PERSONAS[persona].contextLabel}.`);
  }

  async setIntent(intent: IntentToken) {
    this.intent = intent;
    this.intentTaken = true;
    const persona = intentToPersona(intent, this.referrerHint);
    saveIntent({ intent, persona, at: Date.now() });
    this.markActed();
    this.push("observe", `intent · visitor tapped "${intent}".`);
    this.emit();
    await this.runPersona(persona, { fromReferrer: false });
  }

  dismissOverlay() {
    this.overlay = { ...this.overlay, open: false };
    this.dismissedThisSession = true;
    this.push("observe", "visitor dismissed overlay — standing back.");
  }

  /** The visitor has done something meaningful — used to gate "before you go". */
  markActed() {
    if (this.hasActed) return;
    this.hasActed = true;
    this.emit();
  }

  /**
   * Narrator → request a nudge. Centralizes the silence rules: one nudge at a
   * time, each trigger once per session, and a hard per-session cap.
   */
  showNudge(args: {
    id: string;
    kind: NudgeKind;
    tag: string;
    msg: string;
    slug?: CaseSlug;
  }): boolean {
    if (this.nudge.open) return false;
    if (this.firedNudges.has(args.id)) return false;
    if (this.nudgeCount >= MAX_NUDGES_PER_SESSION) return false;
    this.nudge = {
      open: true,
      id: args.id,
      kind: args.kind,
      tag: args.tag,
      msg: args.msg,
      slug: args.slug,
    };
    this.firedNudges.add(args.id);
    this.nudgeCount += 1;
    this.push("observe", `narrator · ${args.kind} nudge — "${args.tag}".`);
    this.emit();
    return true;
  }

  dismissNudge() {
    if (!this.nudge.open) return;
    this.nudge = { open: false, id: "", kind: "", tag: "", msg: "" };
    this.emit();
  }

  openCalendar() {
    this.calendarOpen = true;
    this.markActed();
    this.push("act", "tool_call · open_calendar()");
    this.emit();
  }

  closeCalendar() {
    this.calendarOpen = false;
    this.emit();
  }

  async runPersona(persona: PersonaId, opts: { fromReferrer?: boolean } = {}) {
    if (this.running) return;
    this.running = true;
    const p = PERSONAS[persona];

    try {
      // 1. observing
      this.setState("observing");
      if (opts.fromReferrer) {
        this.push("observe", `inbound referrer matched — ${p.contextLabel}.`);
      } else {
        this.markActed();
        this.push("observe", `explicit persona signal — ${p.contextLabel}.`);
      }
      await this.wait(700);
      this.push("observe", "no active interaction detected; safe to act.");
      await this.wait(400);

      // 2. deciding
      this.setState("deciding");
      this.push(
        "reason",
        `choose hero verb "${p.heroVerb}" and surface ${p.surfaceCount} cases.`,
      );
      await this.wait(500);

      // 3. acting
      this.setState("acting");
      this.persona = persona;
      this.surfacedOrder = [...p.surfaceOrder];
      this.push(
        "act",
        `tool_call · reorder_case_studies([${p.surfaceOrder.join(", ")}])`,
      );
      this.emit();
      await this.wait(350);

      if (p.surfaceCount > 0) {
        this.surfacedSet = new Set(p.surfaceOrder.slice(0, p.surfaceCount));
        this.push(
          "act",
          `tool_call · surface_top_n([${p.surfaceOrder
            .slice(0, p.surfaceCount)
            .join(", ")}], ${p.surfaceCount})`,
        );
        this.emit();
        await this.wait(350);
      }

      this.push(
        "act",
        `tool_call · set_hero_context("${p.contextLabel}", "${p.heroVerb}")`,
      );
      this.emit();
      await this.wait(350);

      if (persona !== "unknown" && !this.dismissedThisSession) {
        this.overlay = {
          open: true,
          ctx: p.contextLabel,
          msg: p.overlayMessage,
          primary: p.overlayPrimary,
          secondary: p.overlaySecondary,
        };
        this.push("act", `tool_call · open_overlay("${p.contextLabel}", …)`);
        this.emit();
        await this.wait(300);
      }

      // 4. back to standby
      this.setState("observing");
      this.push("standby", "standing by.");
    } finally {
      this.running = false;
    }
  }
}

let _agent: Agent | null = null;

export function getAgent(): Agent {
  if (typeof window === "undefined") {
    // Server: synthesize a transient instance (snapshot only used for SSR defaults)
    return new Agent();
  }
  if (!_agent) _agent = new Agent();
  return _agent;
}

export type { Agent };
