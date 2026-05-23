"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getAgent } from "@/lib/agent";
import { DWELL_NUDGE, FOOTER_NUDGE, RETURN_NUDGE } from "@/lib/narrator";
import { CASES } from "@/lib/cases";
import type { CaseSlug } from "@/lib/personas";

const GRACE_MS = 4000; // don't nudge in the first few seconds on a page
const DWELL_MS = 30000; // "dwells 30+ sec on a case study"
const SKIM_VELOCITY = 1.6; // px/ms — above this, the visitor is skimming
const SKIM_COOLDOWN_MS = 900; // stay quiet for a beat after a fast scroll

function isTyping(): boolean {
  if (typeof document === "undefined") return false;
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || (el as HTMLElement).isContentEditable;
}

function slugFromPath(pathname: string): CaseSlug | null {
  const m = pathname.match(/^\/work\/([^/]+)/);
  if (!m) return null;
  const slug = m[1] as CaseSlug;
  return slug in CASES ? slug : null;
}

export default function ChitraNarrator() {
  const pathname = usePathname();
  const armedRef = useRef(false);
  const skimmingUntilRef = useRef(0);

  useEffect(() => {
    const agent = getAgent();
    armedRef.current = false;
    const graceTimer = window.setTimeout(() => {
      armedRef.current = true;
    }, GRACE_MS);

    // --- silence rule: skimming. Track scroll velocity; while fast, suppress.
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        const v = Math.abs(window.scrollY - lastY) / dt;
        if (v > SKIM_VELOCITY) skimmingUntilRef.current = now + SKIM_COOLDOWN_MS;
      }
      lastY = window.scrollY;
      lastT = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const canSpeak = () =>
      armedRef.current &&
      !isTyping() &&
      performance.now() > skimmingUntilRef.current;

    // --- trigger 1: dwell on a case study (only on /work/[slug])
    const slug = slugFromPath(pathname);
    let dwellTimer = 0;
    if (slug) {
      dwellTimer = window.setTimeout(() => {
        if (!canSpeak()) return;
        agent.showNudge({
          id: `dwell:${slug}`,
          kind: "dwell",
          tag: DWELL_NUDGE.tag,
          msg: DWELL_NUDGE.msg,
          slug,
        });
      }, GRACE_MS + DWELL_MS);
    }

    // --- trigger 2: reaches footer without prior action
    const footerEl = document.querySelector('[data-narrate="footer"]');
    const footerObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (agent.snapshot().hasActed) continue;
          if (!canSpeak()) continue;
          agent.showNudge({
            id: "footer",
            kind: "footer",
            tag: FOOTER_NUDGE.tag,
            msg: FOOTER_NUDGE.msg,
          });
        }
      },
      { threshold: 0.4 },
    );
    if (footerEl) footerObserver.observe(footerEl);

    // --- trigger 3: returns to a section already seen (case pages have an EndFrame)
    const hasEndFrame = !!document.querySelector('[data-narrate="endframe"]');
    const seen = new Set<Element>();
    const departed = new Set<Element>();
    let returnFired = false;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id]"),
    );
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target;
          if (e.isIntersecting) {
            if (departed.has(el) && !returnFired && hasEndFrame && canSpeak()) {
              if (agent.snapshot().nudge.open) return;
              returnFired = agent.showNudge({
                id: "return",
                kind: "return",
                tag: RETURN_NUDGE.tag,
                msg: RETURN_NUDGE.msg,
              });
            }
            seen.add(el);
          } else if (seen.has(el)) {
            departed.add(el);
          }
        }
      },
      { threshold: 0.5 },
    );
    sections.forEach((s) => sectionObserver.observe(s));

    return () => {
      window.clearTimeout(graceTimer);
      if (dwellTimer) window.clearTimeout(dwellTimer);
      window.removeEventListener("scroll", onScroll);
      footerObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
