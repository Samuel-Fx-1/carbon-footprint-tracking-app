"use client";

import { useState, useEffect, useCallback } from "react";
import NavBar from "@/components/NavBar";
import HomeDashboard from "@/components/HomeDashboard";
import ActivitiesTab, { Activity } from "@/components/ActivitiesTab";
import InsightsTab from "@/components/InsightsTab";
import CommunityTab from "@/components/CommunityTab";
import ProfileTab from "@/components/ProfileTab";
import LogActivityModal, { ExistingActivity } from "@/components/LogActivityModal";

type Tab = "home" | "activities" | "insights" | "community" | "profile";

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [modalOpen, setModalOpen] = useState(false);
  const [editActivity, setEditActivity] = useState<ExistingActivity | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [seeding, setSeeding] = useState(true);

  // Seed database on first load
  useEffect(() => {
    fetch("/api/seed", { method: "POST" })
      .then(() => setSeeding(false))
      .catch(() => setSeeding(false));
  }, []);

  const handleSaved = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setEditActivity(null);
  }, []);

  const handleEdit = useCallback((activity: Activity) => {
    setEditActivity(activity as ExistingActivity);
    setModalOpen(true);
  }, []);

  const handleLogActivity = useCallback(() => {
    setEditActivity(null);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditActivity(null);
  }, []);

  if (seeding) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0a0f0a",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00c853, #00963e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 30px rgba(0,200,83,0.4)",
            fontSize: "28px",
          }}
        >
          🌱
        </div>
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "3px solid #1e3a1e",
            borderTopColor: "#00c853",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#e8f5e9",
              marginBottom: "4px",
            }}
          >
            EcoTrack
          </div>
          <div style={{ fontSize: "13px", color: "#4a5e4a" }}>
            Initializing your eco dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        minHeight: "100vh",
        background: "#0a0f0a",
        position: "relative",
      }}
    >
      {/* Tab content */}
      <div style={{ display: tab === "home" ? "block" : "none" }}>
        <HomeDashboard
          onLogActivity={handleLogActivity}
          onViewActivities={() => setTab("activities")}
          refreshKey={refreshKey}
        />
      </div>

      <div style={{ display: tab === "activities" ? "block" : "none" }}>
        <ActivitiesTab
          onLogActivity={handleLogActivity}
          refreshKey={refreshKey}
          onEdit={handleEdit}
        />
      </div>

      <div style={{ display: tab === "insights" ? "block" : "none" }}>
        <InsightsTab refreshKey={refreshKey} />
      </div>

      <div style={{ display: tab === "community" ? "block" : "none" }}>
        <CommunityTab />
      </div>

      <div style={{ display: tab === "profile" ? "block" : "none" }}>
        <ProfileTab
          refreshKey={refreshKey}
          onRefresh={() => setRefreshKey((k) => k + 1)}
        />
      </div>

      {/* Navigation */}
      <NavBar active={tab} onChange={setTab} />

      {/* Log Activity Modal */}
      <LogActivityModal
        open={modalOpen}
        onClosne={handleCloseModal}
        onSaved={handleSaved}
        editActivity={editActivity}
      />
    </div>
  );
}
