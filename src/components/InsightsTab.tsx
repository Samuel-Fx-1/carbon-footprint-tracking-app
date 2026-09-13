"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingDown, Award, Flame, Target } from "lucide-react";

interface InsightsData {
  dailyData: Array<{
    day: string;
    total: number;
    transport: number;
    food: number;
    lifestyle: number;
  }>;
  categoryTotals: Array<{ category: string; total: number; count: number }>;
  avgDaily: number;
  totalMonth: number;
  bestDay: { day: string; total: number };
  streak: number;
  dailyTarget: number;
}

const categoryColors: Record<string, string> = {
  transport: "#2196f3",
  food: "#ff9800",
  lifestyle: "#9c27b0",
};

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

const PieTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
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
        <p style={{ color: "#6b7c6b", fontSize: "11px", marginBottom: "4px", textTransform: "capitalize" }}>
          {payload[0]?.name}
        </p>
        <p style={{ color: "#e8f5e9", fontWeight: 600, fontSize: "13px" }}>
          {Number(payload[0]?.value).toFixed(1)} kg
        </p>
      </div>
    );
  }
  return null;
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#111811",
        border: "1px solid #1e2e1e",
        borderRadius: "14px",
        padding: "16px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: color + "22",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <Icon size={18} color={color} />
      </div>
      <div
        style={{ fontSize: "20px", fontWeight: 700, color: "#e8f5e9", lineHeight: 1 }}
      >
        {value}
      </div>
      <div style={{ fontSize: "11px", color: "#4a5e4a", marginTop: "4px" }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: "10px", color: color, marginTop: "2px" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function InsightsTab({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/insights?userId=1");
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
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "2px solid #1e3a1e",
            borderTopColor: "#00c853",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (!data) return null;

  const pieData = data.categoryTotals.map((c) => ({
    name: c.category,
    value: Math.round(Number(c.total) * 10) / 10,
  }));

  // Show only last 14 days for the area chart
  const chartData = data.dailyData.slice(-14);

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
          Insights
        </h1>
        <p style={{ color: "#4a5e4a", fontSize: "13px" }}>
          Last 30 days performance
        </p>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Stat cards row 1 */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <StatCard
            icon={TrendingDown}
            label="Avg Daily"
            value={`${data.avgDaily} kg`}
            sub={
              data.avgDaily <= data.dailyTarget
                ? "Under target ✓"
                : "Over target"
            }
            color={data.avgDaily <= data.dailyTarget ? "#00c853" : "#ff5252"}
          />
          <StatCard
            icon={Target}
            label="Monthly Total"
            value={`${data.totalMonth} kg`}
            sub={`${Math.round(data.totalMonth / 30)} kg/day avg`}
            color="#2196f3"
          />
        </div>

        {/* Stat cards row 2 */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <StatCard
            icon={Award}
            label="Best Day"
            value={`${data.bestDay?.total?.toFixed(1) ?? "–"} kg`}
            sub={data.bestDay?.day ?? ""}
            color="#ff9800"
          />
          <StatCard
            icon={Flame}
            label="Goal Streak"
            value={`${data.streak} days`}
            sub={data.streak > 0 ? "Keep it up! 🔥" : "Start a streak!"}
            color="#ff5252"
          />
        </div>

        {/* Area Chart */}
        <div
          style={{
            background: "#111811",
            border: "1px solid #1e2e1e",
            borderRadius: "16px",
            padding: "16px 20px",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#6b7c6b",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            14-Day Trend
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c853" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00c853" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fill: "#4a5e4a", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fill: "#4a5e4a", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#00c853"
                strokeWidth={2}
                fill="url(#greenGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        {pieData.length > 0 && (
          <div
            style={{
              background: "#111811",
              border: "1px solid #1e2e1e",
              borderRadius: "16px",
              padding: "16px 20px",
              marginBottom: "16px",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#6b7c6b",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Category Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                  paddingAngle={3}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={categoryColors[entry.name] ?? "#00c853"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span
                      style={{
                        color: "#6b7c6b",
                        fontSize: "11px",
                        textTransform: "capitalize",
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Environmental equivalents */}
        <div
          style={{
            background: "linear-gradient(135deg, #0d1f0d, #162116)",
            border: "1px solid #1e3a1e",
            borderRadius: "16px",
            padding: "16px 20px",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#6b7c6b",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Equivalents This Month
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              {
                emoji: "🚗",
                label: "km driven",
                value: Math.round(data.totalMonth / 0.21),
              },
              {
                emoji: "🌳",
                label: "trees needed to offset",
                value: Math.round(data.totalMonth / 21.77),
              },
              {
                emoji: "💡",
                label: "kWh of electricity",
                value: Math.round(data.totalMonth / 0.233),
              },
              {
                emoji: "✈️",
                label: "km of flying",
                value: Math.round(data.totalMonth / 0.255),
              },
            ].map((eq) => (
              <div
                key={eq.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "20px" }}>{eq.emoji}</span>
                  <span style={{ fontSize: "13px", color: "#6b7c6b" }}>
                    {eq.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#00c853",
                  }}
                >
                  {eq.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
