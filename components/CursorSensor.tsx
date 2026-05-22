"use client";

import { useEffect, useRef } from "react";
import styles from "./CursorSensor.module.css";

export default function CursorSensor() {
  const coreRef = useRef<HTMLDivElement | null>(null);
  const auraRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch =
      window.matchMedia("(hover: none) or (pointer: coarse)").matches;
    if (isTouch) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let auraX = targetX;
    let auraY = targetY;
    let active = false;
    let raf = 0;

    const INTERACTIVE = "a, button, .interactive, input, textarea, [role=button]";

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      const el = e.target as HTMLElement | null;
      const hover = !!el?.closest(INTERACTIVE);
      if (hover !== active) {
        active = hover;
        auraRef.current?.classList.toggle(styles.active, active);
      }
    };

    const tick = () => {
      auraX += (targetX - auraX) * 0.18;
      auraY += (targetY - auraY) * 0.18;
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${targetX - 3}px, ${targetY - 3}px, 0)`;
      }
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${auraX - 20}px, ${auraY - 20}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div ref={auraRef} className={styles.aura} aria-hidden />
      <div ref={coreRef} className={styles.core} aria-hidden />
    </>
  );
}
