import Nav from "@/components/Nav";
import CaseStudySpine from "@/components/CaseStudySpine";
import StatStrip from "@/components/StatStrip";
import ArtifactCard from "@/components/ArtifactCard";
import PullQuote from "@/components/PullQuote";
import EndFrame from "@/components/EndFrame";
import FooterCTA from "@/components/FooterCTA";
import { CASES, ALL_SLUGS } from "@/lib/cases";
import { CASE_CONTENT, renderArtifact } from "@/lib/caseContent";
import type { CaseSlug } from "@/lib/personas";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugTyped = slug as CaseSlug;
  const data = CASES[slugTyped];
  const content = CASE_CONTENT[slugTyped];
  if (!data || !content) notFound();

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
            <p className={styles.intro}>{content.intro}</p>
            <div className={styles.heroArtifact}>
              {renderArtifact(content.layer2[0])}
            </div>
            <StatStrip stats={content.stats} />
          </div>
        </section>

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
                  {renderArtifact(a)}
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
      </main>
      <FooterCTA />
    </>
  );
}
