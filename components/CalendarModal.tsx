"use client";

import { useState } from "react";
import { useAgent } from "@/lib/useAgent";
import { getAgent } from "@/lib/agent";
import styles from "./CalendarModal.module.css";

const SLOTS = [
  { day: "Mon 26", time: "10:00" },
  { day: "Mon 26", time: "16:30" },
  { day: "Tue 27", time: "11:00" },
  { day: "Wed 28", time: "09:30" },
  { day: "Thu 29", time: "15:00" },
  { day: "Fri 30", time: "10:30" },
];

export default function CalendarModal() {
  const snap = useAgent();
  const [held, setHeld] = useState<number | null>(null);

  if (!snap.calendarOpen) return null;

  const close = () => {
    getAgent().closeCalendar();
    setHeld(null);
  };

  return (
    <div className={styles.backdrop} onClick={close} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Book a 30-minute call with Anupam"
      >
        <header className={styles.head}>
          <div>
            <div className={styles.kicker}>book · 30 min · video</div>
            <h2 className={styles.title}>
              Pick a <span className="serif-italic">window</span>.
            </h2>
          </div>
          <button className={styles.close} onClick={close} aria-label="Close">
            ×
          </button>
        </header>

        {held === null ? (
          <div className={styles.slots}>
            {SLOTS.map((s, i) => (
              <button key={i} className={styles.slot} onClick={() => setHeld(i)}>
                <span className={styles.day}>{s.day}</span>
                <span className={styles.time}>{s.time}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.held}>
            <div className={styles.check} aria-hidden>
              ✓
            </div>
            <p className={styles.heldMsg}>
              Held{" "}
              <span className="serif-italic">
                {SLOTS[held].day} · {SLOTS[held].time}
              </span>
              . You'll get a calendar invite the moment this lands behind a real
              Cal.com endpoint.
            </p>
            <button className={styles.heldBtn} onClick={close}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
