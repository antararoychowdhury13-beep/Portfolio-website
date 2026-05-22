import Nav from "@/components/Nav";
import SectionHeader from "@/components/SectionHeader";
import FrameworkCard from "@/components/FrameworkCard";
import FooterCTA from "@/components/FooterCTA";

export default function FrameworksPage() {
  return (
    <>
      <Nav />
      <main className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <SectionHeader
          label="frameworks"
          title={
            <>
              Two frameworks. <em>Both in active use.</em>
            </>
          }
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 80 }}>
          <FrameworkCard
            tag="IFU · intent-first ux"
            title="A four-stage spine for AI interfaces"
            titleAccent="four-stage"
            description="Sense, Morph, Confirm, Escape — the four moves an AI interface must make for the visitor to extend it agency."
            stages={["Sense", "Morph", "Confirm", "Escape"]}
            href="#ifu"
          />
          <FrameworkCard
            tag="GRAVITY · spatial"
            title="Four planes for embodied AI"
            titleAccent="Four planes"
            description="Ground, Ring, Atmosphere, Voice — a model for designing agents that live in space, not in rectangles."
            stages={["Ground", "Ring", "Atmosphere", "Voice"]}
            href="#gravity"
          />
        </div>

        <div id="ifu" style={{ paddingTop: 60 }}>
          <SectionHeader
            label="critique surface"
            title={
              <>
                Drop a screenshot. <em>Get scored.</em>
              </>
            }
            meta="ifu · sense · morph · confirm · escape"
          />
          <CritiqueStub />
        </div>
      </main>
      <FooterCTA />
    </>
  );
}

function CritiqueStub() {
  return (
    <div
      style={{
        border: "1px dashed var(--line-strong)",
        borderRadius: 6,
        padding: 60,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
        background: "rgba(10, 13, 20, 0.4)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-meta-s)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--neon)",
        }}
      >
        Critique Surface · stub
      </div>
      <p
        style={{
          fontFamily: "var(--display)",
          fontWeight: 300,
          fontSize: 24,
          color: "var(--ink)",
          maxWidth: 520,
        }}
      >
        Wire this to a Claude vision endpoint. Visitor uploads a screenshot;
        the agent returns four IFU scores, three issues, and one fix.
      </p>
    </div>
  );
}
