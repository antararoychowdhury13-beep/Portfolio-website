import styles from "./CaseArtifacts.module.css";

interface Props {
  label: string;
}

export function BetArtifact({ label }: Props) {
  return (
    <Frame label={label}>
      <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden>
        <defs>
          <linearGradient id="bet-g" x1="0" y1="0.5" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#7dffce" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#7dffce" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <line x1="20" y1="60" x2="160" y2="60" stroke="#3a4156" strokeDasharray="2 4" />
        <path d="M 20 60 L 160 60 L 150 50 M 160 60 L 150 70" stroke="url(#bet-g)" strokeWidth="2" fill="none" />
        <circle cx="20" cy="60" r="4" fill="#7dffce" opacity="0.4" />
        <circle cx="160" cy="60" r="6" fill="#7dffce" />
        <text x="20" y="80" fill="#8089a0" fontSize="7" fontFamily="monospace" letterSpacing="1">today</text>
        <text x="135" y="80" fill="#7dffce" fontSize="7" fontFamily="monospace" letterSpacing="1">the bet</text>
      </svg>
    </Frame>
  );
}

export function AltArtifact({ label }: Props) {
  return (
    <Frame label={label}>
      <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(20, ${20 + i * 30})`}>
            <rect width="160" height="20" fill="none" stroke="#3a4156" strokeDasharray="2 3" />
            <line x1="0" y1="10" x2="160" y2="10" stroke="#ff4d8b" strokeOpacity="0.6" strokeWidth="1" />
            <text x="8" y="14" fill="#8089a0" fontSize="7" fontFamily="monospace">alt 0{i + 1} — rejected</text>
          </g>
        ))}
      </svg>
    </Frame>
  );
}

export function ConstraintArtifact({ label }: Props) {
  return (
    <Frame label={label}>
      <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden>
        <rect x="40" y="20" width="120" height="80" fill="none" stroke="#7dffce" strokeOpacity="0.4" />
        <rect x="60" y="40" width="80" height="40" fill="rgba(125,255,206,0.06)" stroke="#7dffce" strokeOpacity="0.8" />
        {[0, 1, 2, 3].map((i) => {
          const pos = [
            { x: 100, y: 10, dx: 0, dy: 8 },
            { x: 190, y: 60, dx: -8, dy: 0 },
            { x: 100, y: 110, dx: 0, dy: -8 },
            { x: 10, y: 60, dx: 8, dy: 0 },
          ][i];
          return (
            <path
              key={i}
              d={`M ${pos.x} ${pos.y} l ${pos.dx} ${pos.dy}`}
              stroke="#f5c66b"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
          );
        })}
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 z" fill="#f5c66b" />
          </marker>
        </defs>
        <text x="100" y="64" fill="#7dffce" fontSize="8" fontFamily="monospace" textAnchor="middle">surface</text>
      </svg>
    </Frame>
  );
}

export function SystemArtifact({ label }: Props) {
  return (
    <Frame label={label}>
      <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden>
        {[
          { x: 40, y: 60, lbl: "sense" },
          { x: 87, y: 60, lbl: "morph" },
          { x: 133, y: 60, lbl: "confirm" },
          { x: 180, y: 60, lbl: "escape" },
        ].map((n, i, arr) => (
          <g key={n.lbl}>
            {i < arr.length - 1 && (
              <line
                x1={n.x + 8}
                y1={60}
                x2={arr[i + 1].x - 8}
                y2={60}
                stroke="#00d4ff"
                strokeOpacity="0.6"
              />
            )}
            <circle cx={n.x} cy={n.y} r="8" fill="rgba(0,212,255,0.15)" stroke="#7dffce" />
            <text x={n.x} y={86} fill="#8089a0" fontSize="7" fontFamily="monospace" textAnchor="middle" letterSpacing="1">
              {n.lbl}
            </text>
          </g>
        ))}
        <text x="100" y="30" fill="#7dffce" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="2">
          IFU SPINE
        </text>
      </svg>
    </Frame>
  );
}

export function ArtifactArtifact({ label }: Props) {
  return (
    <Frame label={label}>
      <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden>
        <rect x="20" y="10" width="160" height="100" rx="3" fill="rgba(10,13,20,0.6)" stroke="#7dffce" strokeOpacity="0.4" />
        <line x1="20" y1="28" x2="180" y2="28" stroke="#3a4156" strokeDasharray="2 3" />
        <circle cx="32" cy="19" r="3" fill="#7dffce" />
        <text x="42" y="22" fill="#8089a0" fontSize="6" fontFamily="monospace">surface · v1</text>
        <rect x="32" y="40" width="80" height="6" fill="#7dffce" opacity="0.6" />
        <rect x="32" y="52" width="120" height="4" fill="#3a4156" />
        <rect x="32" y="62" width="100" height="4" fill="#3a4156" />
        <rect x="32" y="72" width="60" height="4" fill="#3a4156" />
        <rect x="32" y="88" width="46" height="14" rx="7" fill="#7dffce" />
        <text x="55" y="97" fill="#05060a" fontSize="6" fontFamily="monospace" textAnchor="middle">action →</text>
      </svg>
    </Frame>
  );
}

export function ResultArtifact({ label, value }: Props & { value?: string }) {
  return (
    <Frame label={label}>
      <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden>
        <text
          x="100"
          y="62"
          fill="#7dffce"
          fontSize="44"
          fontFamily="Fraunces, Georgia, serif"
          fontStyle="italic"
          fontWeight="300"
          textAnchor="middle"
        >
          {value ?? "↑ 41%"}
        </text>
        <line x1="40" y1="80" x2="160" y2="80" stroke="#7dffce" strokeOpacity="0.4" />
        <text
          x="100"
          y="94"
          fill="#8089a0"
          fontSize="7"
          fontFamily="monospace"
          textAnchor="middle"
          letterSpacing="2"
        >
          MEASURED · POST-SHIP
        </text>
      </svg>
    </Frame>
  );
}

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.frame}>
      <div className={styles.svg}>{children}</div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export function PickArtifact({ kind, label, value }: { kind: string; label: string; value?: string }) {
  switch (kind) {
    case "BET":
      return <BetArtifact label={label} />;
    case "ALT":
      return <AltArtifact label={label} />;
    case "CONSTRAINT":
      return <ConstraintArtifact label={label} />;
    case "SYSTEM":
      return <SystemArtifact label={label} />;
    case "ARTIFACT":
      return <ArtifactArtifact label={label} />;
    case "RESULT":
      return <ResultArtifact label={label} value={value} />;
    default:
      return <BetArtifact label={label} />;
  }
}
