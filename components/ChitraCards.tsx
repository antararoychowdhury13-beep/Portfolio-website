"use client";

import { useState } from "react";
import Link from "next/link";
import { getAgent } from "@/lib/agent";
import { CASES } from "@/lib/cases";
import type { CaseSlug } from "@/lib/personas";
import styles from "./ChitraCards.module.css";

export interface ChitraCard {
  type: string;
  data: Record<string, unknown>;
}

const ANUPAM_EMAIL = "ar.anupamsarkar@gmail.com";

function s(v: unknown): string {
  return typeof v === "string" ? v : "";
}
function arr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function EmailCard({ data }: { data: Record<string, unknown> }) {
  const subject = s(data.subject);
  const bodyText = s(data.body);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${bodyText}`);
      setCopied(true);
      getAgent().markActed();
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be blocked — the text is visible to copy manually */
    }
  };

  const mailto = `mailto:${ANUPAM_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(bodyText)}`;

  return (
    <div className={styles.card}>
      <div className={styles.cardKick}>// draft · intro email</div>
      <div className={styles.emailSubject}>{subject}</div>
      <p className={styles.emailBody}>{bodyText}</p>
      <div className={styles.actions}>
        <button className={styles.primary} onClick={copy}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
        <a
          className={styles.ghost}
          href={mailto}
          onClick={() => getAgent().markActed()}
        >
          Open in mail app →
        </a>
      </div>
    </div>
  );
}

function JdFitCard({ data }: { data: Record<string, unknown> }) {
  const role = s(data.role_title);
  const verdict = s(data.verdict);
  const score = Math.max(0, Math.min(100, Number(data.score) || 0));
  const strengths = arr(data.strengths);
  const gaps = arr(data.gaps);
  const cases = arr(data.relevant_cases).filter(
    (c): c is CaseSlug => c in CASES,
  ) as CaseSlug[];

  return (
    <div className={styles.card}>
      <div className={styles.cardKick}>// jd fit · {role || "role"}</div>
      <p className={styles.verdict}>{verdict}</p>

      <div className={styles.scoreRow}>
        <div className={styles.scoreTrack}>
          <div className={styles.scoreFill} style={{ width: `${score}%` }} />
        </div>
        <span className={styles.scoreNum}>{score}</span>
      </div>

      {strengths.length > 0 && (
        <ul className={styles.list}>
          {strengths.map((x, i) => (
            <li key={`s${i}`} className={styles.strength}>
              <span className={styles.mark}>+</span> {x}
            </li>
          ))}
        </ul>
      )}

      {gaps.length > 0 && (
        <ul className={styles.list}>
          {gaps.map((x, i) => (
            <li key={`g${i}`} className={styles.gap}>
              <span className={styles.markGap}>△</span> {x}
            </li>
          ))}
        </ul>
      )}

      {cases.length > 0 && (
        <div className={styles.caseChips}>
          {cases.map((slug) => (
            <Link
              key={slug}
              href={`/work/${slug}`}
              className={styles.caseChip}
              onClick={() => getAgent().markActed()}
            >
              {CASES[slug].tag.split(" · ")[0]} ↗
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function IfuAuditCard({ data }: { data: Record<string, unknown> }) {
  const stages: { k: string; label: string }[] = [
    { k: "sense", label: "Sense" },
    { k: "morph", label: "Morph" },
    { k: "confirm", label: "Confirm" },
    { k: "escape", label: "Escape" },
  ];
  return (
    <div className={styles.card}>
      <div className={styles.cardKick}>// ifu audit · {s(data.product) || "product"}</div>
      <div className={styles.stages}>
        {stages.map((st) => (
          <div key={st.k} className={styles.stage}>
            <div className={styles.stageLabel}>{st.label}</div>
            <p className={styles.stageBody}>{s(data[st.k])}</p>
          </div>
        ))}
      </div>
      {s(data.summary) && <p className={styles.summary}>{s(data.summary)}</p>}
    </div>
  );
}

function BookCallCard() {
  return (
    <div className={styles.card}>
      <div className={styles.cardKick}>// book · 30-min call</div>
      <p className={styles.bookLine}>
        Direct line to Anupam — a focused 30 minutes, async-friendly.
      </p>
      <div className={styles.actions}>
        <button
          className={styles.primary}
          onClick={() => getAgent().openCalendar()}
        >
          Book a call →
        </button>
      </div>
    </div>
  );
}

function DeepDiveCard({ data }: { data: Record<string, unknown> }) {
  const email = s(data.visitor_email);
  const company = s(data.company_name);
  const role = s(data.role_title);
  const target = [role, company].filter(Boolean).join(" at ") || "the role";

  return (
    <div className={styles.card}>
      <div className={styles.cardKick}>// agent · deep dive</div>
      <p className={styles.bookLine}>
        On it. I&apos;ll research {company || "the company"}, match {target} against
        Anupam&apos;s case studies, and email him a fit memo with a draft reply.
        He&apos;ll come back to you at <strong>{email}</strong> within a few
        minutes.
      </p>
    </div>
  );
}

export default function ChitraCardView({ card }: { card: ChitraCard }) {
  switch (card.type) {
    case "draft_intro_email":
      return <EmailCard data={card.data} />;
    case "analyze_jd_fit":
      return <JdFitCard data={card.data} />;
    case "run_ifu_audit":
      return <IfuAuditCard data={card.data} />;
    case "book_call":
      return <BookCallCard />;
    case "request_deep_dive":
      return <DeepDiveCard data={card.data} />;
    default:
      return null;
  }
}
