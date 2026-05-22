"use client";

import Nav from "@/components/Nav";
import FooterCTA from "@/components/FooterCTA";
import { getAgent } from "@/lib/agent";

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="container" style={{ paddingTop: 80, paddingBottom: 80, maxWidth: 760 }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta-s)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--neon)",
            marginBottom: 24,
          }}
        >
          // contact
        </div>
        <h1
          style={{
            fontFamily: "var(--display)",
            fontWeight: 300,
            fontSize: "var(--t-display-l)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            marginBottom: 32,
          }}
        >
          The form is{" "}
          <em
            style={{
              fontStyle: "italic",
              background: "linear-gradient(90deg, var(--neon), var(--neon-2))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            the agent.
          </em>
        </h1>
        <p
          style={{
            fontFamily: "var(--display)",
            fontWeight: 300,
            fontSize: 20,
            lineHeight: 1.5,
            color: "var(--ink-dim)",
            marginBottom: 48,
            maxWidth: 560,
          }}
        >
          I don't run a contact form. Book a window, or write directly. I read
          everything within 24 hours, async.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360 }}>
          <button
            onClick={() => getAgent().openCalendar()}
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta-l)",
              letterSpacing: "0.08em",
              padding: "16px 20px",
              borderRadius: 100,
              background: "var(--neon)",
              color: "var(--bg)",
              textAlign: "left",
            }}
          >
            Book a 30-min call →
          </button>
          <a
            href="mailto:ar.anupamsarkar@gmail.com"
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta-l)",
              letterSpacing: "0.08em",
              padding: "16px 20px",
              borderRadius: 100,
              border: "1px solid var(--line)",
              color: "var(--ink)",
            }}
          >
            ar.anupamsarkar@gmail.com ↗
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta-l)",
              letterSpacing: "0.08em",
              padding: "16px 20px",
              borderRadius: 100,
              border: "1px solid var(--line)",
              color: "var(--ink)",
            }}
          >
            LinkedIn ↗
          </a>
        </div>
      </main>
      <FooterCTA />
    </>
  );
}
