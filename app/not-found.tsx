import Link from "next/link";
import Nav from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main
        className="container"
        style={{ paddingTop: 120, paddingBottom: 120, textAlign: "center" }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta-s)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--neon)",
            marginBottom: 24,
          }}
        >
          // 404
        </div>
        <h1
          style={{
            fontFamily: "var(--display)",
            fontWeight: 300,
            fontSize: "var(--t-display-l)",
            lineHeight: 1.05,
            marginBottom: 24,
          }}
        >
          The agent doesn't know this surface yet.
        </h1>
        <Link
          href="/"
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta-l)",
            color: "var(--neon)",
            letterSpacing: "0.1em",
          }}
        >
          ← Back to work
        </Link>
      </main>
    </>
  );
}
