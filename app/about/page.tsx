import Nav from "@/components/Nav";
import FooterCTA from "@/components/FooterCTA";

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 80, alignItems: "start" }}>
          <article style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 640 }}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "var(--t-meta-s)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--neon)",
              }}
            >
              // about
            </div>
            <h1
              style={{
                fontFamily: "var(--display)",
                fontWeight: 300,
                fontSize: "var(--t-display-l)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              I take complex systems and{" "}
              <em
                style={{
                  fontStyle: "italic",
                  background: "linear-gradient(90deg, var(--neon), var(--neon-2))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                bend them into intelligence.
              </em>
            </h1>
            <Prose>
              Twelve years across IBM, Siemens, John Deere, and BT. Director-equivalent
              for the last four — leading teams from 6 to 40, shipping enterprise
              platforms and consumer products at scale, and writing two design
              frameworks that are now in use outside my own work.
            </Prose>
            <Prose>
              Today I lead the design of <em>AI-native</em> systems — products
              where the interface itself behaves. The portfolio you are reading is
              one of them. The agent is real; the persona detection is real;
              the tool calls are real. The site is the proof.
            </Prose>
            <Prose>
              I'm interviewing for Design Director, VP of Design, and AI Product
              Design Lead roles in 2026. I prefer engagements where I can ship
              within the first 60 days — and where the team trusts the designer
              to hold the line on quality.
            </Prose>
          </article>

          <aside
            style={{
              padding: 24,
              border: "1px solid var(--line)",
              borderRadius: 6,
              background: "rgba(10, 13, 20, 0.5)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta-l)",
            }}
          >
            <div style={{ color: "var(--neon)", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: "var(--t-meta-s)" }}>
              operating system
            </div>
            <OpRow label="default mode" value="deep work, 90-min blocks" />
            <OpRow label="comms" value="async-first" />
            <OpRow label="tools" value="figma · cursor · linear" />
            <OpRow label="based" value="london" />
            <OpRow label="open to" value="london / NYC / remote" />
          </aside>
        </div>
      </main>
      <FooterCTA />
    </>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--display)",
        fontWeight: 300,
        fontSize: 20,
        lineHeight: 1.5,
        color: "var(--ink)",
      }}
    >
      {children}
    </p>
  );
}

function OpRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: "1px dashed var(--line)" }}>
      <span style={{ color: "var(--ink-faint)", fontSize: "var(--t-meta-xs)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ color: "var(--ink)" }}>{value}</span>
    </div>
  );
}
