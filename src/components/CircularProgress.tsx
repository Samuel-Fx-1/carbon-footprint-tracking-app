"use client";

interface CircularProgressProps {
  value: number;
  target: number;
  size?: number;
}

export default function CircularProgress({
  value,
  target,
  size = 200,
}: CircularProgressProps) {
  const pct = Math.min(value / target, 1);
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct);
  const isOver = value > target;

  const center = size / 2;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#1a2e1a"
          strokeWidth={10}
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={isOver ? "#ff5252" : "#00c853"}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: "stroke-dashoffset 1s ease, stroke 0.3s ease",
            filter: isOver
              ? "drop-shadow(0 0 8px rgba(255,82,82,0.5))"
              : "drop-shadow(0 0 8px rgba(0,200,83,0.5))",
          }}
        />
      </svg>

      {/* Center text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
        }}
      >
        <div
          style={{
            fontSize: size * 0.165,
            fontWeight: 700,
            color: isOver ? "#ff5252" : "#00c853",
            lineHeight: 1,
            letterSpacing: "-1px",
          }}
        >
          {value.toFixed(1)}
        </div>
        <div
          style={{
            fontSize: size * 0.07,
            color: "#6b7c6b",
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          kg CO₂e
        </div>
        <div
          style={{
            fontSize: size * 0.06,
            color: "#4a5e4a",
            marginTop: "2px",
          }}
        >
          of {target} target
        </div>
      </div>
    </div>
  );
}
