import Link from "next/link";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <div className="container">
        <div className={styles.row}>
          <Link href="/" className={styles.brand}>
            <span className={styles.dot} aria-hidden />
            <span className={styles.brandText}>
              Anupam <span className="serif-italic">Sarkar</span>
            </span>
          </Link>
          <div className={styles.links}>
            <Link href="/" className={styles.link}>
              Work
            </Link>
            <Link href="/frameworks" className={styles.link}>
              Frameworks
            </Link>
            <Link href="/about" className={styles.link}>
              About
            </Link>
            <Link href="/contact" className={styles.linkAccent}>
              Contact ↗
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
