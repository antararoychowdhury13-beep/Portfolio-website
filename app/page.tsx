"use client";

import { useMemo, useState } from "react";
import Nav from "@/components/Nav";
import VisitorTag from "@/components/VisitorTag";
import HeroTitle from "@/components/HeroTitle";
import HeroSubtitle from "@/components/HeroSubtitle";
import StatStrip from "@/components/StatStrip";
import SectionHeader from "@/components/SectionHeader";
import FilterStrip from "@/components/FilterStrip";
import ProjectCard from "@/components/ProjectCard";
import DivyaChatSurface from "@/components/DivyaChatSurface";
import FrameworkCard from "@/components/FrameworkCard";
import CapabilityMatrix from "@/components/CapabilityMatrix";
import FooterCTA from "@/components/FooterCTA";
import IntentMoment from "@/components/IntentMoment";
import WhyAmISeeingThis from "@/components/WhyAmISeeingThis";
import { ALL_SLUGS, FILTER_MAP } from "@/lib/cases";
import { useAgent } from "@/lib/useAgent";
import styles from "./page.module.css";

const FILTERS = ["Everything", "AI-native", "Enterprise", "Consumer", "Leadership"];

const HOME_STATS = [
  { value: "12", label: "years shipping" },
  { value: "40+", label: "designers led" },
  { value: "4", label: "F500 brands" },
  { value: "2", label: "original frameworks" },
];

export default function HomePage() {
  const snap = useAgent();
  const [filter, setFilter] = useState("Everything");
  const [renderCount, setRenderCount] = useState(0);

  const allowed = FILTER_MAP[filter] ?? ALL_SLUGS;
  const orderedAll = useMemo(() => snap.surfacedOrder, [snap.surfacedOrder]);

  const flag =
    snap.surfacedSet.size > 0 ? `re-ordered for ${snap.persona}` : undefined;

  return (
    <>
      <Nav />
      <main>
        {!snap.intentTaken && (
          <section className={styles.intent}>
            <div className="container">
              <IntentMoment />
            </div>
          </section>
        )}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroGrid}>
              <div className={styles.heroLeft}>
                <VisitorTag />
                <HeroTitle />
                <HeroSubtitle />
                <div className={styles.heroMeta}>
                  <span className={styles.kicker}>// status</span>
                  <span>open to: Director · VP · AI Lead</span>
                  <span className={styles.dot} aria-hidden />
                  <span>London / remote</span>
                  <WhyAmISeeingThis />
                </div>
              </div>
              <div className={styles.heroRight}>
                <DivyaChatSurface />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.stats}>
          <div className="container">
            <StatStrip stats={HOME_STATS} />
          </div>
        </section>

        <section id="work" className={styles.work}>
          <div className="container">
            <SectionHeader
              label="selected work"
              title={
                <>
                  Six cases. <em>One thesis.</em>
                </>
              }
              meta={`${allowed.length} of ${ALL_SLUGS.length}`}
              flag={flag}
            />

            <FilterStrip
              filters={FILTERS}
              active={filter}
              renderCount={renderCount}
              onChange={(f) => {
                setFilter(f);
                setRenderCount((n) => n + 1);
              }}
            />

            <div className={styles.grid}>
              {orderedAll.map((slug, i) => (
                <ProjectCard
                  key={slug}
                  slug={slug}
                  visible={allowed.includes(slug)}
                  orderIndex={i}
                />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.frameworks}>
          <div className="container">
            <SectionHeader
              label="original frameworks"
              title={
                <>
                  Two frameworks. <em>Both in active use.</em>
                </>
              }
            />
            <div className={styles.fwGrid}>
              <FrameworkCard
                tag="IFU · intent-first ux"
                title="A four-stage spine for AI interfaces"
                titleAccent="four-stage"
                description="Sense, Morph, Confirm, Escape. The model I use to design any product where the interface itself behaves."
                stages={["Sense", "Morph", "Confirm", "Escape"]}
                href="/frameworks#ifu"
              />
              <FrameworkCard
                tag="GRAVITY · spatial ui"
                title="Four planes for embodied AI"
                titleAccent="Four planes"
                description="Ground, Ring, Atmosphere, Voice. A spatial model for designing agents that don't belong in 2D rectangles."
                stages={["Ground", "Ring", "Atmosphere", "Voice"]}
                href="/frameworks#gravity"
              />
            </div>
          </div>
        </section>

        <section className={styles.capability}>
          <div className="container">
            <SectionHeader
              label="capability"
              title={
                <>
                  Self-rated, <em>honestly.</em>
                </>
              }
              meta="updated · may 26"
            />
            <CapabilityMatrix />
          </div>
        </section>

        <FooterCTA />
      </main>
    </>
  );
}
