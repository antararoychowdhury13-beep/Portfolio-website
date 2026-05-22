"use client";

import { useState, useRef, useEffect } from "react";
import { getAgent } from "@/lib/agent";
import { useAgent } from "@/lib/useAgent";
import styles from "./DivyaChatSurface.module.css";

interface Msg {
  id: string;
  from: "divya" | "visitor";
  text: string;
}

const SUGGESTIONS = [
  { label: "Show me the AI work", persona: "recruiter-ai-lab" as const },
  { label: "Enterprise platforms", persona: "enterprise-hiring" as const },
  { label: "Founder lens", persona: "founder" as const },
  { label: "Just the craft", persona: "peer-designer" as const },
];

export default function DivyaChatSurface() {
  const snap = useAgent();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: "m0",
      from: "divya",
      text:
        "Hi — I'm Divya, the interface for this portfolio. Tell me what you're looking for and I'll reshape the surface around it.",
    },
  ]);
  const [input, setInput] = useState("");
  const counter = useRef(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs.length]);

  const pushMsg = (from: "divya" | "visitor", text: string) => {
    counter.current += 1;
    setMsgs((m) => [...m, { id: `m${counter.current}`, from, text }]);
  };

  const handleSuggestion = (s: (typeof SUGGESTIONS)[number]) => {
    pushMsg("visitor", s.label);
    setTimeout(() => {
      pushMsg(
        "divya",
        "Got it. Reading the rail in the corner — you'll see me observe, decide, and act in real time.",
      );
      getAgent().runPersona(s.persona);
    }, 280);
  };

  const handleSend = () => {
    const v = input.trim();
    if (!v) return;
    pushMsg("visitor", v);
    setInput("");
    setTimeout(() => {
      const lower = v.toLowerCase();
      let persona: Parameters<ReturnType<typeof getAgent>["runPersona"]>[0] = "unknown";
      if (/ai|llm|agent|claude|gpt|anthropic|openai/.test(lower)) persona = "recruiter-ai-lab";
      else if (/enterprise|platform|ibm|saas/.test(lower)) persona = "enterprise-hiring";
      else if (/founder|startup|yc|ship/.test(lower)) persona = "founder";
      else if (/craft|design|figma|typography/.test(lower)) persona = "peer-designer";

      if (persona === "unknown") {
        pushMsg("divya", "Tell me whether you're hiring, building, or just looking at craft — I'll act on it.");
      } else {
        pushMsg("divya", "Understood. Reading the rail — you'll see what I'm thinking.");
        getAgent().runPersona(persona);
      }
    }, 320);
  };

  return (
    <div className={styles.surface}>
      <header className={styles.head}>
        <div className={styles.orb} aria-hidden />
        <div className={styles.headTitle}>
          <span className="serif-italic">Divya</span>
          <span className={styles.status}>{snap.state}</span>
        </div>
        <span className={styles.kicker}>chat ·</span>
      </header>

      <div ref={scrollRef} className={styles.log} aria-live="polite">
        {msgs.map((m) =>
          m.from === "divya" ? (
            <div key={m.id} className={styles.divya}>
              <div className={styles.caption}>Divya</div>
              <p className={styles.divyaText}>{m.text}</p>
            </div>
          ) : (
            <div key={m.id} className={styles.visitor}>
              <p>{m.text}</p>
            </div>
          ),
        )}
      </div>

      <div className={styles.suggestions}>
        {SUGGESTIONS.map((s) => (
          <button key={s.persona} className={styles.chip} onClick={() => handleSuggestion(s)}>
            {s.label}
          </button>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          placeholder="ask Divya…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          aria-label="Send a message to Divya"
        />
        <button className={styles.send} onClick={handleSend} aria-label="Send">
          →
        </button>
      </div>
    </div>
  );
}
