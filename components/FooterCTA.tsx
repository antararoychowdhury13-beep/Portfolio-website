"use client";

import { getAgent } from "@/lib/agent";
import styles from "./FooterCTA.module.css";

export default function FooterCTA() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.kicker}>// closing</div>
            <h2 className={styles.title}>
              You've read this far.
              <br />
              <span className="serif-italic">Let's talk.</span>
            </h2>
            <p className={styles.sub}>
              I'm interviewing for Design Director and AI Product Design Lead roles in 2026.
              I prefer async-first conversation that gets concrete fast.
            </p>
          </div>

          <div className={styles.right}>
            <button
              className={styles.primary}
              onClick={() => getAgent().openCalendar()}
            >
              Book a 30-min call →
            </button>
            <a className={styles.btn} href="#">
              Download case deck (PDF)
            </a>
            <a className={styles.btn} href="mailto:ar.anupamsarkar@gmail.com">
              ar.anupamsarkar@gmail.com
            </a>
            <a className={styles.btn} href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>
        </div>

        <div className={styles.meta}>
          <span>© 2026 Anupam Sarkar</span>
          <span>built · v0.1 · agent-native</span>
          <span>The agent is the form.</span>
        </div>
      </div>
    </footer>
  );
}
