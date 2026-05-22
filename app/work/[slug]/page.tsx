import Nav from "@/components/Nav";
import CaseStudySpine from "@/components/CaseStudySpine";
import StatStrip from "@/components/StatStrip";
import ArtifactCard from "@/components/ArtifactCard";
import PullQuote from "@/components/PullQuote";
import EndFrame from "@/components/EndFrame";
import FooterCTA from "@/components/FooterCTA";
import { CASES, ALL_SLUGS, type CaseSummary } from "@/lib/cases";
import type { CaseSlug } from "@/lib/personas";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

interface CaseContent {
  intro: string;
  stats: { value: string; label: string }[];
  layer2: { num: string; kind: string; caption: string; visual: React.ReactNode }[];
  quote: string;
  depth: { heading: string; body: string }[];
  proves: string;
  next: CaseSlug | undefined;
}

const CONTENT: Partial<Record<CaseSlug, CaseContent>> = {
  "dfd-divya": {
    intro:
      "I led the design of Divya — a devotional companion built on Claude that does not look like a chat app. The interface itself is the agent: it observes the visitor's ritual context, narrates its reasoning, and reshapes the surface around what is being practiced. Two years from sketch to shipped, with 180k devotees this month.",
    stats: [
      { value: "180k", label: "monthly devotees" },
      { value: "92%", label: "retention · 30d" },
      { value: "<400ms", label: "agent response" },
      { value: "1", label: "interface, not a chatbot" },
    ],
    layer2: [
      {
        num: "01",
        kind: "BET",
        caption:
          "If the interface is the agent — not a feature inside a chat — devotional users will stop treating AI as a curiosity and start treating it as a participant in the ritual.",
        visual: <SimpleArtifact label="The shape of the bet" />,
      },
      {
        num: "02",
        kind: "ALT",
        caption:
          "I considered three rejected alternatives: a chatbot with a Sanskrit skin, a voice-only experience, and a pure dashboard. Each one made the AI a tool, not a presence.",
        visual: <SimpleArtifact label="Three rejected futures" />,
      },
      {
        num: "03",
        kind: "CONSTRAINT",
        caption:
          "Devotional users distrust shiny UI. They want gravity, silence, and ritual permanence. Every animation had to feel earned, not performed.",
        visual: <SimpleArtifact label="The restraint constraint" />,
      },
      {
        num: "04",
        kind: "SYSTEM",
        caption:
          "I built the Sense → Morph → Confirm → Escape spine (IFU). Every screen has one job at one stage. The agent never spans two stages without consent.",
        visual: <SimpleArtifact label="IFU applied — 4 stages, 1 surface" />,
      },
      {
        num: "05",
        kind: "ARTIFACT",
        caption:
          "The Panchang Engine — a generative almanac that computes 60k events a year. The agent reads it as context before it speaks. It is why Divya never feels generic.",
        visual: <SimpleArtifact label="Panchang Engine · context layer" />,
      },
      {
        num: "06",
        kind: "RESULT",
        caption:
          "180k MAU at month four. 92% 30-day retention. The interface, not the model, is what people credit when they describe what Divya does.",
        visual: <SimpleArtifact label="92% retention — 30d cohort" />,
      },
    ],
    quote:
      "The hardest part of designing an agent is not making it smart. It is making its intelligence legible — letting the visitor see it observe, decide, act — without turning the interface into a debugger.",
    depth: [
      {
        heading: "Why the chat metaphor was the wrong starting point",
        body:
          "Every other devotional product starts from chat. Chat is a 1990s metaphor for a 2026 problem — it forces the agent into a turn-taking rhythm that is incompatible with ritual. Ritual is ambient, recursive, and silent more than it speaks. We started from the ritual and let the agent inhabit it, not the other way around.",
      },
      {
        heading: "The four-state agent loop",
        body:
          "Idle, observing, deciding, acting. The states are visible because legibility is the entire trust mechanic. When the visitor sees the agent thinking — for at least 600ms — they extend it grace. When they don't, they assume scripted nonsense. The pause is not lag; it is the proof.",
      },
      {
        heading: "Where Claude lives in the system",
        body:
          "Claude is the reasoning kernel; it never sees the visitor's full state. The interface is the orchestration layer. Tool calls — reorder_ritual, surface_mantra, narrate_intent — are written in code, called by the model, executed by the UI. The model never touches the DOM. The DOM never touches the model. That separation is the design.",
      },
    ],
    proves:
      "I can lead the design of an AI-native product end-to-end — thesis, framework, system, surface, ship — at consumer scale.",
    next: "intent-first-ux",
  },
};

function SimpleArtifact({ label }: { label: string }) {
  return (
    <div className={styles.placeholder}>
      <div className={styles.placeholderInner}>
        <svg width="100%" height="100%" viewBox="0 0 200 120" aria-hidden>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7dffce" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="198" height="118" fill="url(#g1)" stroke="#7dffce" strokeOpacity="0.3" strokeDasharray="3 3" />
          <circle cx="100" cy="60" r="22" fill="none" stroke="#7dffce" strokeOpacity="0.7" />
          <circle cx="100" cy="60" r="36" fill="none" stroke="#00d4ff" strokeOpacity="0.4" strokeDasharray="2 4" />
          <line x1="20" y1="60" x2="78" y2="60" stroke="#7dffce" strokeOpacity="0.3" />
          <line x1="122" y1="60" x2="180" y2="60" stroke="#7dffce" strokeOpacity="0.3" />
        </svg>
        <span className={styles.placeholderLabel}>{label}</span>
      </div>
    </div>
  );
}

function StubContent({ data }: { data: CaseSummary }) {
  return (
    <div className={styles.stub}>
      <div className={styles.stubKicker}>// case · in production</div>
      <p className={styles.stubText}>
        Full case study currently being written. The structure follows the same three-layer
        spine as the DFD case study — Hero, Middle (six artifact cards), and Depth. Below is
        the working thesis.
      </p>
      <p className={styles.stubLede}>{data.description}</p>
    </div>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugTyped = slug as CaseSlug;
  const data = CASES[slugTyped];
  if (!data) notFound();

  const content = CONTENT[slugTyped];
  const currentIndex = ALL_SLUGS.indexOf(slugTyped);
  const nextSlug = ALL_SLUGS[(currentIndex + 1) % ALL_SLUGS.length];

  return (
    <>
      <Nav />
      <CaseStudySpine />
      <main>
        <section id="hero" className={styles.hero}>
          <div className="container">
            <div className={styles.heroMeta}>
              <span className={styles.tag}>{data.tag}</span>
              <span>·</span>
              <span>{data.year}</span>
            </div>
            <h1 className={styles.title}>
              {data.title.split(data.titleAccent)[0]}
              <em>{data.titleAccent}</em>
              {data.title.split(data.titleAccent)[1]}
            </h1>
            <p className={styles.intro}>
              {content?.intro ?? data.description}
            </p>
            <div className={styles.heroArtifact}>
              <SimpleArtifact label={`${slug} · primary artifact`} />
            </div>
            {(content?.stats ?? [
              { value: data.year, label: "shipped" },
              { value: "—", label: "scale" },
              { value: "—", label: "metric" },
              { value: "1", label: "thesis" },
            ]).length > 0 && (
              <StatStrip stats={content?.stats ?? [
                { value: data.year, label: "shipped" },
                { value: "—", label: "scale" },
                { value: "—", label: "result" },
                { value: "1", label: "thesis" },
              ]} />
            )}
          </div>
        </section>

        {content ? (
          <>
            <section id="middle" className={styles.middle}>
              <div className="container">
                <div className={styles.layerLabel}>// layer 02 · middle</div>
                <h2 className={styles.layerTitle}>
                  Six artifacts. <em>Each carries the argument.</em>
                </h2>
                <div className={styles.cards}>
                  {content.layer2.map((a) => (
                    <ArtifactCard
                      key={a.num}
                      num={a.num}
                      kind={a.kind}
                      caption={a.caption}
                    >
                      {a.visual}
                    </ArtifactCard>
                  ))}
                </div>
              </div>
            </section>

            <div className="container">
              <PullQuote>{content.quote}</PullQuote>
            </div>

            <section id="depth" className={styles.depth}>
              <div className="container">
                <div className={styles.layerLabel}>// layer 03 · depth</div>
                <h2 className={styles.layerTitle}>
                  The <em>reasoning</em> behind the surface.
                </h2>
                <div className={styles.depthGrid}>
                  {content.depth.map((d) => (
                    <article key={d.heading} className={styles.depthItem}>
                      <h3 className={styles.depthHeading}>{d.heading}</h3>
                      <p className={styles.depthBody}>{d.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <div className="container">
              <EndFrame proves={content.proves} nextSlug={content.next} />
            </div>
          </>
        ) : (
          <section id="middle" className={styles.middle}>
            <div className="container">
              <StubContent data={data} />
              <EndFrame
                proves={`${data.title} — full case study coming. Talk to me about it for the long version.`}
                nextSlug={nextSlug}
              />
            </div>
          </section>
        )}
      </main>
      <FooterCTA />
    </>
  );
}
