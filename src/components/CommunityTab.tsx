"use client";

import { useEffect, useState } from "react";
import { Trophy, Users, Zap, CheckCircle } from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  targetCo2e: number;
  durationDays: number;
}

const leaderboard = [
  { rank: 1, name: "Sarah M.", score: 8.2, badge: "🥇", trend: "↓" },
  { rank: 2, name: "Tom K.", score: 10.1, badge: "🥈", trend: "→" },
  { rank: 3, name: "Alex Green", score: 14.2, badge: "🥉", isYou: true, trend: "↓" },
  { rank: 4, name: "Maya P.", score: 15.8, badge: "4", trend: "↑" },
  { rank: 5, name: "Chris L.", score: 17.3, badge: "5", trend: "→" },
  { rank: 6, name: "Jordan R.", score: 19.1, badge: "6", trend: "↑" },
];

const tips = [
  {
    emoji: "🚲",
    title: "Cycle More",
    desc: "Replacing a 5km car trip with cycling saves ~1.2 kg CO₂e",
  },
  {
    emoji: "🥗",
    title: "Go Plant-Based",
    desc: "One plant-based meal saves up to 2.5 kg CO₂e vs beef",
  },
  {
    emoji: "🌡️",
    title: "Reduce Heating by 1°C",
    desc: "Saves ~8% on your heating emissions",
  },
  {
    emoji: "♻️",
    title: "Buy Second-Hand",
    desc: "Cuts clothing footprint by up to 70%",
  },
];

export default function CommunityTab() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [joined, setJoined] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/challenges")
      .then((r) => r.json())
      .then((d) => setChallenges(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleJoin = (id: number) => {
    setJoined((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ paddingBottom: "80px" }}>
      {/* Header */}
      <div
        style={{
          padding: "24px 20px 16px",
          background: "linear-gradient(180deg, #0d1a0d 0%, #0a0f0a 100%)",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#e8f5e9",
            marginBottom: "4px",
          }}
        >
          Community
        </h1>
        <p style={{ color: "#4a5e4a", fontSize: "13px" }}>
          Compete, connect & inspire
        </p>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Leaderboard */}
        <div
          style={{
            background: "#111811",
            border: "1px solid #1e2e1e",
            borderRadius: "16px",
            padding: "16px 20px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <Trophy size={16} color="#ffd700" />
            <h2
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#6b7c6b",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Weekly Leaderboard
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {leaderboard.map((person) => (
              <div
                key={person.rank}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: person.isYou
                    ? "rgba(0,200,83,0.08)"
                    : "transparent",
                  border: person.isYou
                    ? "1px solid rgba(0,200,83,0.2)"
                    : "1px solid transparent",
                }}
              >
                <span
                  style={{
                    fontSize: person.rank <= 3 ? "18px" : "13px",
                    fontWeight: 700,
                    color: "#4a5e4a",
                    width: "24px",
                    textAlign: "center",
                  }}
                >
                  {person.badge}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "14px",
                    fontWeight: person.isYou ? 700 : 500,
                    color: person.isYou ? "#00c853" : "#c8e6c9",
                  }}
                >
                  {person.name}
                  {person.isYou && (
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#00c853",
                        marginLeft: "6px",
                        background: "rgba(0,200,83,0.15)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      YOU
                    </span>
                  )}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#e8f5e9",
                    }}
                  >
                    {person.score} kg
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color:
                        person.trend === "↓"
                          ? "#00c853"
                          : person.trend === "↑"
                          ? "#ff5252"
                          : "#6b7c6b",
                    }}
                  >
                    {person.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "12px",
              padding: "10px",
              background: "#0d140d",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "center", gap: "24px" }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#00c853" }}>
                  247
                </div>
                <div style={{ fontSize: "10px", color: "#4a5e4a" }}>
                  Members
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#ff9800" }}>
                  38
                </div>
                <div style={{ fontSize: "10px", color: "#4a5e4a" }}>
                  Active Challenges
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#2196f3" }}>
                  12.4t
                </div>
                <div style={{ fontSize: "10px", color: "#4a5e4a" }}>
                  CO₂ Saved
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges */}
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <Zap size={16} color="#ff9800" />
            <h2
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#6b7c6b",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Active Challenges
            </h2>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "20px", color: "#4a5e4a" }}>
              Loading...
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {challenges.map((c) => {
                const isJoined = joined.has(c.id);
                return (
                  <div
                    key={c.id}
                    style={{
                      background: "#111811",
                      border: "1px solid #1e2e1e",
                      borderRadius: "14px",
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#e8f5e9",
                            marginBottom: "4px",
                          }}
                        >
                          {c.title}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#4a5e4a",
                            marginBottom: "8px",
                          }}
                        >
                          {c.description}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#00c853",
                              background: "rgba(0,200,83,0.1)",
                              border: "1px solid rgba(0,200,83,0.2)",
                              borderRadius: "4px",
                              padding: "2px 6px",
                            }}
                          >
                            🎯 {c.targetCo2e} kg target
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#2196f3",
                              background: "rgba(33,150,243,0.1)",
                              border: "1px solid rgba(33,150,243,0.2)",
                              borderRadius: "4px",
                              padding: "2px 6px",
                            }}
                          >
                            📅 {c.durationDays} days
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleJoin(c.id)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "10px",
                          border: isJoined
                            ? "1px solid rgba(0,200,83,0.4)"
                            : "1px solid rgba(0,200,83,0.3)",
                          background: isJoined
                            ? "rgba(0,200,83,0.15)"
                            : "rgba(0,200,83,0.08)",
                          color: "#00c853",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                          transition: "all 0.2s",
                        }}
                      >
                        {isJoined ? (
                          <>
                            <CheckCircle size={12} /> Joined
                          </>
                        ) : (
                          "Join"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Eco Tips */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <Users size={16} color="#00c853" />
            <h2
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#6b7c6b",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Eco Tips
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            {tips.map((t) => (
              <div
                key={t.title}
                style={{
                  background: "#111811",
                  border: "1px solid #1e2e1e",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                  {t.emoji}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#c8e6c9",
                    marginBottom: "4px",
                  }}
                >
                  {t.title}
                </div>
                <div style={{ fontSize: "11px", color: "#4a5e4a" }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
