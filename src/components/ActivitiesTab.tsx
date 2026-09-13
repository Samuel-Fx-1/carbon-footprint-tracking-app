"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import ActivityIcon from "./ActivityIcon";
import { Trash2, Edit3, ChevronDown, ChevronUp } from "lucide-react";

export interface Activity {
  id: number;
  activityType: string;
  description: string;
  co2e: number;
  distance: number | null;
  unit: string | null;
  category: "transport" | "food" | "lifestyle";
  loggedAt: string;
}

interface ActivitiesTabProps {
  onLogActivity: () => void;
  refreshKey: number;
  onEdit: (activity: Activity) => void;
}


const categoryColors: Record<string, string> = {
  transport: "#2196f3",
  food: "#ff9800",
  lifestyle: "#9c27b0",
};

const categoryFilters = ["all", "transport", "food", "lifestyle"] as const;
type FilterType = (typeof categoryFilters)[number];

export default function ActivitiesTab({
  onLogActivity,
  refreshKey,
  onEdit,
}: ActivitiesTabProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/activities?userId=1");
      const data = await res.json();
      setActivities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities, refreshKey]);

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await fetch(`/api/activities/${id}`, { method: "DELETE" });
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const filtered =
    filter === "all" ? activities : activities.filter((a) => a.category === filter);

  // Group by date
  const grouped: Record<string, Activity[]> = {};
  for (const a of filtered) {
    const dateKey = format(new Date(a.loggedAt), "yyyy-MM-dd");
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(a);
  }

  const sortedDates = Object.keys(grouped).sort((a, b) =>
    b.localeCompare(a)
  );

  const totalToday = (() => {
    const today = format(new Date(), "yyyy-MM-dd");
    return (grouped[today] ?? []).reduce((s, a) => s + a.co2e, 0);
  })();

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
          Activities
        </h1>
        <p style={{ color: "#4a5e4a", fontSize: "13px" }}>
          Today:{" "}
          <span style={{ color: "#00c853", fontWeight: 600 }}>
            {totalToday.toFixed(1)} kg CO₂e
          </span>
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "0 16px 16px",
          overflowX: "auto",
        }}
      >
        {categoryFilters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border:
                filter === f
                  ? "1px solid #00c853"
                  : "1px solid #1e2e1e",
              background: filter === f ? "rgba(0,200,83,0.12)" : "#111811",
              color: filter === f ? "#00c853" : "#6b7c6b",
              fontSize: "12px",
              fontWeight: filter === f ? 600 : 400,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
              textTransform: "capitalize",
            }}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px",
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
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#4a5e4a",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌱</div>
          <p style={{ fontSize: "16px", marginBottom: "8px", color: "#6b7c6b" }}>
            No activities found
          </p>
          <p style={{ fontSize: "13px", marginBottom: "20px" }}>
            Start logging to track your footprint
          </p>
          <button
            onClick={onLogActivity}
            style={{
              background: "linear-gradient(135deg, #00c853, #00963e)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Log Activity
          </button>
        </div>
      ) : (
        <div style={{ padding: "0 16px" }}>
          {sortedDates.map((dateKey) => {
            const dayActivities = grouped[dateKey];
            const dayTotal = dayActivities.reduce((s, a) => s + a.co2e, 0);
            const isToday =
              dateKey === format(new Date(), "yyyy-MM-dd");
            const dateObj = new Date(dateKey + "T12:00:00");

            return (
              <div key={dateKey} style={{ marginBottom: "20px" }}>
                {/* Date header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    padding: "0 4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: isToday ? "#00c853" : "#4a5e4a",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {isToday
                      ? "Today"
                      : format(dateObj, "EEE, MMM d")}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#6b7c6b",
                      fontWeight: 500,
                    }}
                  >
                    {dayTotal.toFixed(1)} kg CO₂e
                  </span>
                </div>

                {/* Activities */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                >
                  {dayActivities.map((activity) => {
                    const isExpanded = expandedId === activity.id;
                    return (
                      <div
                        key={activity.id}
                        style={{
                          background: "#111811",
                          borderRadius: "12px",
                          border: "1px solid #1e2e1e",
                          overflow: "hidden",
                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          style={{
                            padding: "12px 14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setExpandedId(isExpanded ? null : activity.id)
                          }
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
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "#fff",
                                  background:
                                    categoryColors[activity.category] + "33",
                                  border: `1px solid ${categoryColors[activity.category]}66`,
                                  borderRadius: "4px",
                                  padding: "1px 6px",
                                  textTransform: "capitalize",
                                }}
                              >
                                {activity.category}
                              </span>
                              <span
                                style={{ fontSize: "11px", color: "#4a5e4a" }}
                              >
                                {format(new Date(activity.loggedAt), "h:mm a")}
                              </span>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div style={{ textAlign: "right" }}>
                              <div
                                style={{
                                  fontSize: "15px",
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
                                {activity.co2e === 0
                                  ? "0"
                                  : `+${activity.co2e.toFixed(1)}`}
                              </div>
                              <div
                                style={{ fontSize: "10px", color: "#4a5e4a" }}
                              >
                                kg CO₂e
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp size={14} color="#4a5e4a" />
                            ) : (
                              <ChevronDown size={14} color="#4a5e4a" />
                            )}
                          </div>
                        </div>

                        {/* Expanded actions */}
                        {isExpanded && (
                          <div
                            style={{
                              borderTop: "1px solid #1a2a1a",
                              padding: "10px 14px",
                              display: "flex",
                              gap: "8px",
                              justifyContent: "flex-end",
                              background: "#0d140d",
                            }}
                          >
                            {activity.distance && (
                              <span
                                style={{
                                  flex: 1,
                                  fontSize: "12px",
                                  color: "#4a5e4a",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                📍 {activity.distance} {activity.unit ?? "km"}
                              </span>
                            )}
                            <button
                              onClick={() => onEdit(activity)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                background: "rgba(33,150,243,0.1)",
                                border: "1px solid rgba(33,150,243,0.3)",
                                color: "#2196f3",
                                borderRadius: "8px",
                                padding: "6px 12px",
                                fontSize: "12px",
                                cursor: "pointer",
                                fontWeight: 500,
                              }}
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(activity.id)}
                              disabled={deleting === activity.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                background: "rgba(255,82,82,0.1)",
                                border: "1px solid rgba(255,82,82,0.3)",
                                color: "#ff5252",
                                borderRadius: "8px",
                                padding: "6px 12px",
                                fontSize: "12px",
                                cursor: "pointer",
                                fontWeight: 500,
                                opacity: deleting === activity.id ? 0.5 : 1,
                              }}
                            >
                              <Trash2 size={12} />
                              {deleting === activity.id ? "..." : "Delete"}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
