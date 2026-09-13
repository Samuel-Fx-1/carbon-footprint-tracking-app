"use client";

import { useEffect, useState } from "react";
import {
  User,
  Target,
  Bell,
  Download,
  ChevronRight,
  Check,
  Leaf,
} from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
  dailyTarget: number;
}

interface ProfileTabProps {
  refreshKey: number;
  onRefresh: () => void;
}

export default function ProfileTab({ refreshKey, onRefresh }: ProfileTabProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [editing, setEditing] = useState<"name" | "target" | null>(null);
  const [nameVal, setNameVal] = useState("");
  const [targetVal, setTargetVal] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  useEffect(() => {
    fetch("/api/user?userId=1")
      .then((r) => r.json())
      .then((d) => {
        setUser(d);
        setNameVal(d.name);
        setTargetVal(String(d.dailyTarget));
      })
      .catch(console.error);
  }, [refreshKey]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch("/api/user?userId=1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameVal,
          dailyTarget: Number(targetVal),
        }),
      });
      const updated = await res.json();
      setUser(updated);
      setEditing(null);
      setSaved(true);
      onRefresh();
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const targetPresets = [10, 15, 20, 25, 30];

  if (!user) {
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

  return (
    <div style={{ paddingBottom: "80px" }}>
      {/* Header */}
      <div
        style={{
          padding: "24px 20px 20px",
          background: "linear-gradient(180deg, #0d1a0d 0%, #0a0f0a 100%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00c853, #00963e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            boxShadow: "0 0 30px rgba(0,200,83,0.3)",
          }}
        >
          <Leaf size={32} color="#fff" />
        </div>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#e8f5e9" }}>
          {user.name}
        </h1>
        <p style={{ color: "#4a5e4a", fontSize: "13px", marginTop: "4px" }}>
          {user.email}
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "10px",
            background: "rgba(0,200,83,0.1)",
            border: "1px solid rgba(0,200,83,0.2)",
            borderRadius: "20px",
            padding: "4px 14px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#00c853",
            }}
          />
          <span style={{ fontSize: "12px", color: "#00c853", fontWeight: 500 }}>
            Eco Member
          </span>
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        {saved && (
          <div
            style={{
              background: "rgba(0,200,83,0.12)",
              border: "1px solid rgba(0,200,83,0.3)",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#00c853",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            <Check size={16} /> Profile saved successfully!
          </div>
        )}

        {/* Profile Settings */}
        <div
          style={{
            background: "#111811",
            border: "1px solid #1e2e1e",
            borderRadius: "16px",
            padding: "16px 20px",
            marginBottom: "14px",
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
            <User size={14} color="#6b7c6b" />
            <h2
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#6b7c6b",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Profile
            </h2>
          </div>

          {/* Name */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                fontSize: "11px",
                color: "#4a5e4a",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Display Name
            </label>
            {editing === "name" ? (
              <input
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                style={{
                  width: "100%",
                  background: "#0d140d",
                  border: "1px solid #00c853",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  color: "#e8f5e9",
                  fontSize: "14px",
                  outline: "none",
                }}
                autoFocus
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => setEditing("name")}
              >
                <span style={{ fontSize: "15px", color: "#e8f5e9" }}>
                  {user.name}
                </span>
                <ChevronRight size={16} color="#4a5e4a" />
              </div>
            )}
          </div>

          <div
            style={{ height: "1px", background: "#1a2a1a", margin: "0 0 16px" }}
          />

          {/* Email */}
          <div>
            <label
              style={{
                fontSize: "11px",
                color: "#4a5e4a",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Email
            </label>
            <span style={{ fontSize: "15px", color: "#6b7c6b" }}>
              {user.email}
            </span>
          </div>
        </div>

        {/* Daily Target */}
        <div
          style={{
            background: "#111811",
            border: "1px solid #1e2e1e",
            borderRadius: "16px",
            padding: "16px 20px",
            marginBottom: "14px",
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
            <Target size={14} color="#6b7c6b" />
            <h2
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#6b7c6b",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Daily Target
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <input
              type="number"
              value={targetVal}
              onChange={(e) => {
                setTargetVal(e.target.value);
                setEditing("target");
              }}
              min={1}
              max={100}
              step={0.5}
              style={{
                width: "100px",
                background: "#0d140d",
                border: "1px solid #1e3a1e",
                borderRadius: "10px",
                padding: "10px",
                color: "#00c853",
                fontSize: "22px",
                fontWeight: 700,
                textAlign: "center",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#00c853")}
              onBlur={(e) => (e.target.style.borderColor = "#1e3a1e")}
            />
            <span style={{ fontSize: "16px", color: "#4a5e4a" }}>kg CO₂e / day</span>
          </div>

          {/* Presets */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            {targetPresets.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setTargetVal(String(p));
                  setEditing("target");
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border:
                    Number(targetVal) === p
                      ? "1px solid #00c853"
                      : "1px solid #1e2e1e",
                  background:
                    Number(targetVal) === p
                      ? "rgba(0,200,83,0.15)"
                      : "#0d140d",
                  color:
                    Number(targetVal) === p ? "#00c853" : "#4a5e4a",
                  fontSize: "12px",
                  fontWeight: Number(targetVal) === p ? 700 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "#4a5e4a",
              textAlign: "center",
              marginBottom: "4px",
            }}
          >
            🌍 Global average: ~12 kg/day · Paris goal: ~5.5 kg/day
          </div>
        </div>

        {/* Preferences */}
        <div
          style={{
            background: "#111811",
            border: "1px solid #1e2e1e",
            borderRadius: "16px",
            padding: "16px 20px",
            marginBottom: "14px",
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
            <Bell size={14} color="#6b7c6b" />
            <h2
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#6b7c6b",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Preferences
            </h2>
          </div>

          {[
            {
              label: "Activity Reminders",
              sub: "Daily push notifications",
              state: notifications,
              toggle: () => setNotifications((v) => !v),
            },
            {
              label: "Weekly Report",
              sub: "Email summary every Monday",
              state: weeklyReport,
              toggle: () => setWeeklyReport((v) => !v),
            },
          ].map((pref) => (
            <div
              key={pref.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #1a2a1a",
              }}
            >
              <div>
                <div style={{ fontSize: "14px", color: "#c8e6c9" }}>
                  {pref.label}
                </div>
                <div style={{ fontSize: "11px", color: "#4a5e4a" }}>
                  {pref.sub}
                </div>
              </div>
              <div
                onClick={pref.toggle}
                style={{
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  background: pref.state ? "#00c853" : "#1a2a1a",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s",
                  border: pref.state
                    ? "1px solid #00c853"
                    : "1px solid #2a3a2a",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: "#fff",
                    top: "2px",
                    left: pref.state ? "22px" : "2px",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Export */}
        <div
          style={{
            background: "#111811",
            border: "1px solid #1e2e1e",
            borderRadius: "16px",
            padding: "16px 20px",
            marginBottom: "20px",
          }}
        >
          <button
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(33,150,243,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Download size={18} color="#2196f3" />
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: "14px", color: "#c8e6c9", fontWeight: 500 }}>
                Export Report
              </div>
              <div style={{ fontSize: "11px", color: "#4a5e4a" }}>
                Download CSV of your emissions data
              </div>
            </div>
            <ChevronRight size={16} color="#4a5e4a" />
          </button>
        </div>

        {/* Save Button */}
        {(editing || nameVal !== user.name || Number(targetVal) !== user.dailyTarget) && (
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #00c853, #00963e)",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              padding: "16px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              boxShadow: "0 4px 20px rgba(0,200,83,0.3)",
              letterSpacing: "0.02em",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}

        {/* App version */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#2a3a2a",
            fontSize: "11px",
          }}
        >
          EcoTrack v1.0.0 · Made with 🌱
        </div>
      </div>
    </div>
  );
}
