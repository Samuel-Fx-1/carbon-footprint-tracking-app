"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import CircularProgress from "./CircularProgress";
import ActivityIcon from "./ActivityIcon";
import { Plus, TrendingDown, TrendingUp, ChevronRight } from "lucide-react";

interface DashboardData {
  user: { name: string; dailyTarget: number };
  todayTotal: number;
  dailyTarget: number;
  breakdown: { transport: number; food: number; lifestyle: number };
  weeklyData: Array<{
    day: string;
    total: number;
    transport: number;
    food: number;
    lifestyle: number;
  }>;
  recentActivities: Array<{
    id: number;
    activityType: string;
    description: string;
    co2e: number;
    distance: number | null;
    unit: string | null;
    category: "transport" | "food" | "lifestyle";
    loggedAt: string;
  }>;
}

interface HomeDashboardProps {
  onLogActivity: () => void;
  onViewActivities: () => void;
  refreshKey: number;
}

const categoryColors: Record<string, string> = {
  transport: "#2196f3",
  food: "#ff9800",
  lifestyle: "#9c27b0",
};

function ProgressBar({
  label,
  value,
  total,
  color,
  onClick,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  onClick?: () => void;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        padding: "12px 0",
        borderBottom: "1px solid #1a2a1a",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: color,
            }}
          />
          <span
            style={{ fontSize: "14px", fontWeight: 500, color: "#c8e6c9" }}
          >
            {label}
          </span>
          <span style={{ fontSize: "11px", color: "#4a5e4a" }}>{pct}%</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#e8f5e9" }}>
            {value.toFixed(1)} kg
          </span>
          {onClick && <ChevronRight size={14} color="#4a5e4a" />}
        </div>
      </div>
      <div
        style={{
          height: "6px",
          background: "#1a2a1a",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: "3px",
            transition: "width 0.8s ease",
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#162116",
          border: "1px solid #1e3a1e",
          borderRadius: "8px",
          padding: "8px 12px",
        }}
      >
        <p style={{ color: "#6b7c6b", fontSize: "11px", marginBottom: "4px" }}>
          {label}
        </p>
        <p style={{ color: "#00c853", fontWeight: 600, fontSize: "13px" }}>
          {payload[0]?.value?.toFixed(1)} kg CO₂e
        </p>
      </div>
    );
  }
  return null;
};

export default function HomeDashboard({
  onLogActivity,
  onViewActivities,
  refreshKey,
}: HomeDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard?userId=1");
      if (!res.ok) throw new Error("Failed");
      const d = await res.json();
      setData(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #1e3a1e",
            borderTopColor: "#00c853",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <span style={{ color: "#4a5e4a", fontSize: "14px" }}>
          Loading your data...
        </span>
      </div>
    );
  }

  if (!data) return null;

  const now = new Date();
  const isUnderTarget = data.todayTotal <= data.dailyTarget;
  const totalBreakdown =
    data.breakdown.transport + data.breakdown.food + data.breakdown.lifestyle;

  return (
    <div style={{ paddingBottom: "80px" }}>
      {/* Header */}
      <div
        style={{git remote add origin https://github.com/Samuel-Fx-1/carbon-footprint-tracking-app.git
git push -u origin main
          padding: "24px 20px 16px",
          background:
            "linear-gradient(180deg, #0d1a0d 0%, #0a0f0a 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "4px",
          }}
        >
          <div>
            <p style={{ color: "#4a5e4a", fontSize: "13px", marginBottom: "2px" }}>
              {format(now, "EEEE, MMMM d")}
            </p>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#e8f5e9",
                lineHeight: 1.2,
              }}
            >
              Hello, {data.user.name.split(" ")[0]} 👋
            </h1>
          </div>
          <div
            style={{
              background: "#111811",
              border: "1px solid #1e2e1e",
              borderRadius: "12px",
              padding: "8px 12px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#4a5e4a",
                marginBottom: "2px",
                letterSpacing: "0.05em",
              }}
            >
              DAILY TARGET
            </div>
            <div
              style={{ fontSize: "16px", fontWeight: 700, color: "#00c853" }}
            >
              {data.dailyTarget} kg
            </div>
          </div>
        </div>
      </div>

      {/* Circular Progress */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px 20px 24px",
          gap: "16px",
        }}
      >
        <CircularProgress
          value={data.todayTotal}
          target={data.dailyTarget}
          size={180}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isUnderTarget ? (
            <>
              <TrendingDown size={16} color="#00c853" />
              <span style={{ color: "#00c853", fontSize: "13px", fontWeight: 500 }}>
                {(data.dailyTarget - data.todayTotal).toFixed(1)} kg under target
              </span>
            </>
          ) : (
            <>
              <TrendingUp size={16} color="#ff5252" />
              <span style={{ color: "#ff5252", fontSize: "13px", fontWeight: 500 }}>
                {(data.todayTotal - data.dailyTarget).toFixed(1)} kg over target
              </span>
            </>
          )}
        </div>

        <button
          onClick={onLogActivity}
          style={{
            background: "linear-gradient(135deg, #00c853, #00963e)",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            padding: "14px 32px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 20px rgba(0,200,83,0.35)",
            transition: "all 0.2s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.03)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          <Plus size={18} />
          Track Your Journey
        </button>
      </div>

      {/* Today's Breakdown */}
      <div
        style={{
          margin: "0 16px 16px",
          background: "#111811",
          borderRadius: "16px",
          padding: "16px 20px",
          border: "1px solid #1e2e1e",
        }}
      >
        <h2
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#6b7c6b",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          Today&apos;s Breakdown
        </h2>
        <ProgressBar
          label="Transport"
          value={data.breakdown.transport}
          total={totalBreakdown}
          color={categoryColors.transport}
          onClick={onViewActivities}
        />
        <ProgressBar
          label="Food"
          value={data.breakdown.food}
          total={totalBreakdown}
          color={categoryColors.food}
          onClick={onViewActivities}
        />
        <div style={{ borderBottom: "none" }}>
          <ProgressBar
            label="Lifestyle"
            value={data.breakdown.lifestyle}
            total={totalBreakdown}
            color={categoryColors.lifestyle}
            onClick={onViewActivities}
          />
        </div>
      </div>

      {/* Weekly Chart */}
      <div
        style={{
          margin: "0 16px 16px",
          background: "#111811",
          borderRadius: "16px",
          padding: "16px 20px",
          border: "1px solid #1e2e1e",
        }}
      >
        <h2
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#6b7c6b",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          This Week
        </h2>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart
            data={data.weeklyData}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              tick={{ fill: "#4a5e4a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#4a5e4a", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1a2e1a" }} />
            <ReferenceLine
              y={data.dailyTarget}
              stroke="#00c853"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
            />
            <Bar dataKey="transport" stackId="a" fill="#2196f3" radius={[0, 0, 0, 0]} />
            <Bar dataKey="food" stackId="a" fill="#ff9800" radius={[0, 0, 0, 0]} />
            <Bar dataKey="lifestyle" stackId="a" fill="#9c27b0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "8px",
            justifyContent: "center",
          }}
        >
          {[
            { label: "Transport", color: "#2196f3" },
            { label: "Food", color: "#ff9800" },
            { label: "Lifestyle", color: "#9c27b0" },
          ].map((l) => (
            <div
              key={l.label}
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "2px",
                  background: l.color,
                }}
              />
              <span style={{ fontSize: "10px", color: "#4a5e4a" }}>
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div style={{ margin: "0 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#6b7c6b",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Recent Activities
          </h2>
          <button
            onClick={onViewActivities}
            style={{
              background: "none",
              border: "none",
              color: "#00c853",
              fontSize: "12px",
              cursor: "pointer",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            See all <ChevronRight size={12} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {data.recentActivities.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px",
                color: "#4a5e4a",
                fontSize: "14px",
                background: "#111811",
                borderRadius: "12px",
                border: "1px solid #1e2e1e",
              }}
            >
              No activities yet. Start tracking!
            </div>
          ) : (
            data.recentActivities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  background: "#111811",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  border: "1px solid #1e2e1e",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.15s",
                }}
              >
                <ActivityIcon
                  type={activity.activityType}
                  category={activity.category}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#e8f5e9",
                      marginBottom: "2px",
                    }}
                  >
                    {activity.description}
                  </div>
                  <div style={{ fontSize: "11px", color: "#4a5e4a" }}>
                    {format(new Date(activity.loggedAt), "h:mm a")}
                    {activity.distance
                      ? ` · ${activity.distance} km`
                      : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color:
                        activity.co2e === 0
                          ? "#00c853"
                          : activity.co2e < 2
                          ? "#69f0ae"
                          : activity.co2e < 5
                          ? "#ffcc02"
                          : "#ff5252",
                    }}
                  >
                    {activity.co2e === 0 ? "0" : `+${activity.co2e.toFixed(1)}`}
                  </div>
                  <div style={{ fontSize: "10px", color: "#4a5e4a" }}>
                    kg CO₂e
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
