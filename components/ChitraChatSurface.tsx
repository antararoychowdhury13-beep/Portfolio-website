"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAgent } from "@/lib/useAgent";
import { getAgent } from "@/lib/agent";
import { CHITRA_OPENING_LINE } from "@/lib/chitra-prompt";
import styles from "./ChitraChatSurface.module.css";

type MsgFrom = "chitra" | "visitor";

interface Msg {
  id: string;
  from: MsgFrom;
  text: string;
}

interface ChitraResponse {
  reply?: string;
  error?: string;
  source?: "claude" | "fallback";
}

const SUGGESTIONS = [
  { label: "Show me the AI work", persona: "recruiter-ai-lab" as const },
  { label: "Enterprise platforms", persona: "enterprise-hiring" as const },
  { label: "Founder lens", persona: "founder" as const },
  { label: "Just the craft", persona: "peer-designer" as const },
];

const FALLBACK_ON_NETWORK_ERROR =
  "I lost the line for a moment. The case studies below are the safest path while I reconnect.";

function supportsSpeech(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof window.SpeechSynthesisUtterance !== "undefined"
  );
}

export default function ChitraChatSurface() {
  const snap = useAgent();
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "m0", from: "chitra", text: CHITRA_OPENING_LINE },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const counter = useRef(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const speechAvailable = useRef(false);

  useEffect(() => {
    speechAvailable.current = supportsSpeech();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs.length, pending]);

  const speak = useCallback((text: string) => {
    if (!voiceOn || !speechAvailable.current) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.98;
      u.pitch = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      /* swallow — voice is best-effort */
    }
  }, [voiceOn]);

  const pushMsg = useCallback((from: MsgFrom, text: string) => {
    counter.current += 1;
    const next: Msg = { id: `m${counter.current}`, from, text };
    setMsgs((m) => [...m, next]);
    if (from === "chitra") speak(text);
  }, [speak]);

  const callChitra = useCallback(
    async (history: Msg[]) => {
      const payload = {
        messages: history
          .filter((m) => m.id !== "m0")
          .map((m) => ({
            role: m.from === "chitra" ? ("assistant" as const) : ("user" as const),
            content: m.text,
          })),
      };
      try {
        const res = await fetch("/api/chitra", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as ChitraResponse;
        if (data.reply) return data.reply;
        return data.error ?? FALLBACK_ON_NETWORK_ERROR;
      } catch {
        return FALLBACK_ON_NETWORK_ERROR;
      }
    },
    [],
  );

  const handleSend = useCallback(async () => {
    const v = input.trim();
    if (!v || pending) return;
    setInput("");
    setPending(true);
    counter.current += 1;
    const visitorMsg: Msg = {
      id: `m${counter.current}`,
      from: "visitor",
      text: v,
    };
    const next = [...msgs, visitorMsg];
    setMsgs(next);
    const reply = await callChitra(next);
    pushMsg("chitra", reply);
    setPending(false);
  }, [input, msgs, pending, callChitra, pushMsg]);

  const handleSuggestion = useCallback(
    (s: (typeof SUGGESTIONS)[number]) => {
      pushMsg("visitor", s.label);
      pushMsg(
        "chitra",
        "Reordering the surface for you — watch the rail and the project grid.",
      );
      void getAgent().runPersona(s.persona);
    },
    [pushMsg],
  );

  const toggleVoice = useCallback(() => {
    if (!speechAvailable.current) return;
    setVoiceOn((v) => {
      const next = !v;
      if (!next) {
        try { window.speechSynthesis.cancel(); } catch { /* */ }
      }
      return next;
    });
  }, []);

  return (
    <div className={styles.surface}>
      <header className={styles.head}>
        <div className={styles.orb} aria-hidden />
        <div className={styles.headTitle}>
          <span className="serif-italic">Chitra</span>
          <span className={styles.status}>{snap.state}</span>
        </div>
        <button
          type="button"
          className={`${styles.voiceBtn} ${voiceOn ? styles.voiceOn : ""}`}
          onClick={toggleVoice}
          aria-label={voiceOn ? "Mute Chitra's voice" : "Unmute Chitra's voice"}
          aria-pressed={voiceOn}
          title={
            speechAvailable.current
              ? voiceOn ? "Voice on" : "Voice off"
              : "Voice not supported in this browser"
          }
          disabled={!speechAvailable.current}
        >
          {voiceOn ? "♪" : "○"}
        </button>
      </header>

      <div ref={scrollRef} className={styles.log} aria-live="polite">
        {msgs.map((m) =>
          m.from === "chitra" ? (
            <div key={m.id} className={styles.chitra}>
              <div className={styles.caption}>Chitra</div>
              <p className={styles.chitraText}>{m.text}</p>
            </div>
          ) : (
            <div key={m.id} className={styles.visitor}>
              <p>{m.text}</p>
            </div>
          ),
        )}
        {pending && (
          <div className={styles.chitra}>
            <div className={styles.caption}>Chitra</div>
            <p className={styles.thinking}>
              <span className={styles.dot} /> <span className={styles.dot} /> <span className={styles.dot} />
            </p>
          </div>
        )}
      </div>

      <div className={styles.suggestions}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s.persona}
            type="button"
            className={styles.chip}
            onClick={() => handleSuggestion(s)}
            disabled={pending}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          placeholder="ask Chitra…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") void handleSend(); }}
          aria-label="Send a message to Chitra"
          disabled={pending}
        />
        <button
          type="button"
          className={styles.send}
          onClick={() => void handleSend()}
          aria-label="Send"
          disabled={pending || input.trim().length === 0}
        >
          →
        </button>
      </div>
    </div>
  );
}
