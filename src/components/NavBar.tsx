"use client";

import { Home, Activity, BarChart3, Users, User } from "lucide-react";
import clsx from "clsx";

type Tab = "home" | "activities" | "insights" | "community" | "profile";

interface NavBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const navItems: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "activities", label: "Activities", Icon: Activity },
  { id: "insights", label: "Insights", Icon: BarChart3 },
  { id: "community", label: "Community", Icon: Users },
  { id: "profile", label: "Profile", Icon: User },
];

export default function NavBar({ active, onChange }: NavBarProps) {
  return (
    <nav
      style={{
        background: "#0d140d",
        borderTop: "1px solid #1e2e1e",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "64px",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        {navItems.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                padding: "8px 12px",
                border: "none",
                background: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                color: isActive ? "#00c853" : "#4a5e4a",
                position: "relative",
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "24px",
                    height: "2px",
                    background: "#00c853",
                    borderRadius: "0 0 2px 2px",
                  }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ transition: "all 0.2s" }}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.02em",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
