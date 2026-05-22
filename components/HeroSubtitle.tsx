import styles from "./HeroSubtitle.module.css";

export default function HeroSubtitle() {
  return (
    <p className={styles.sub}>
      Twelve years bending complex systems into intelligence. Enterprise platforms
      at <em>IBM</em> and <em>BT</em>; consumer rituals at scale; today, the
      design of AI-native products where the interface itself behaves — observes,
      reasons, acts.
    </p>
  );
}
