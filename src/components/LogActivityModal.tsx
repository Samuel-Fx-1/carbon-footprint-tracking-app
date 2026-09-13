"use client";

import { useState, useEffect } from "react";
import { X, Check, ChevronDown } from "lucide-react";

interface ActivityFormData {
  category: "transport" | "food" | "lifestyle";
  activityType: string;
  description: string;
  co2e: number;
  distance?: number;
  unit?: string;
}

export interface ExistingActivity {
  id: number;
  category: "transport" | "food" | "lifestyle";
  activityType: string;
  description: string;
  co2e: number;
  distance: number | null | undefined;
  unit?: string | null;
  loggedAt: string;
}

interface LogActivityModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editActivity?: ExistingActivity | null;
}

const CATEGORIES = {
  transport: {
    label: "Transport",
    color: "#2196f3",
    emoji: "🚗",
    options: [
      { type: "Bike", label: "Bicycle", co2e: 0.0, hasDistance: true },
      { type: "Walk", label: "Walking", co2e: 0.0, hasDistance: true },
      { type: "Bus", label: "Bus", co2e: 1.2, hasDistance: true, perKm: 0.089 },
      { type: "Train", label: "Train / Metro", co2e: 0.5, hasDistance: true, perKm: 0.041 },
      { type: "Car", label: "Car (petrol)", co2e: 2.8, hasDistance: true, perKm: 0.21 },
      { type: "Car", label: "Car (electric)", co2e: 0.6, hasDistance: true, perKm: 0.05 },
      { type: "Plane", label: "Short-haul Flight", co2e: 45.0, hasDistance: true, perKm: 0.255 },
    ],
  },
  food: {
    label: "Food",
    color: "#ff9800",
    emoji: "🍽️",
    options: [
      { type: "Food", label: "Vegan Meal", co2e: 0.5 },
      { type: "Food", label: "Veggie Meal", co2e: 1.0 },
      { type: "Food", label: "Chicken Dish", co2e: 2.6 },
      { type: "Beef", label: "Beef Meal", co2e: 5.8 },
      { type: "Food", label: "Fish Dish", co2e: 1.9 },
      { type: "Coffee", label: "Coffee / Beverage", co2e: 0.34 },
      { type: "Food", label: "Dairy Product", co2e: 1.4 },
    ],
  },
  lifestyle: {
    label: "Lifestyle",
    color: "#9c27b0",
    emoji: "🏠",
    options: [
      { type: "Energy", label: "Home Energy (per kWh)", co2e: 0.233 },
      { type: "Streaming", label: "Streaming (per hour)", co2e: 0.036 },
      { type: "Shopping", label: "Online Shopping", co2e: 2.1 },
      { type: "Shopping", label: "Clothing Purchase", co2e: 6.5 },
      { type: "Water", label: "Hot Shower (per min)", co2e: 0.08 },
      { type: "Energy", label: "Appliance Usage", co2e: 0.5 },
    ],
  },
} as const;

type CategoryKey = keyof typeof CATEGORIES;

export default function LogActivityModal({
  open,
  onClose,
  onSaved,
  editActivity,
}: LogActivityModalProps) {
  const [step, setStep] = useState<"category" | "details">("category");
  const [category, setCategory] = useState<CategoryKey>("transport");
  const [selectedOption, setSelectedOption] = useState<
    (typeof CATEGORIES.transport.options)[0] | null
  >(null);
  const [description, setDescription] = useState("");
  const [co2e, setCo2e] = useState("");
  const [distance, setDistance] = useState("");
  const [saving, setSaving] = useState(false);

  const isEdit = !!editActivity;

  useEffect(() => {
    if (editActivity) {
      setCategory(editActivity.category as CategoryKey);
      setDescription(editActivity.description);
      setCo2e(String(editActivity.co2e));
      setDistance(editActivity.distance ? String(editActivity.distance) : "");
      setStep("details");
    } else {
      setStep("category");
      setCategory("transport");
      setSelectedOption(null);
      setDescription("");
      setCo2e("");
      setDistance("");
    }
  }, [editActivity, open]);

  const handleSelectOption = (
    opt: (typeof CATEGORIES.transport.options)[0]
  ) => {
    setSelectedOption(opt as typeof selectedOption);
    setDescription(opt.label);
    setCo2e(String(opt.co2e));
    setDistance("");
    setStep("details");
  };

  // Auto-calculate CO2e when distance changes
  useEffect(() => {
    if (selectedOption && distance) {
      const perKm = "perKm" in selectedOption ? (selectedOption.perKm as number | undefined) : undefined;
      if (perKm !== undefined && perKm > 0) {
        const calc = (Number(distance) * perKm).toFixed(2);
        setCo2e(calc);
      }
    }
  }, [distance, selectedOption]);

  const handleSave = async () => {
    if (!description || co2e === "") return;
    setSaving(true);
    try {
      const payload = {
        userId: 1,
        category,
        activityType: selectedOption?.type ?? editActivity?.activityType ?? "Other",
        description,
        co2e: Number(co2e),
        distance: distance ? Number(distance) : null,
        unit: "km",
      };

      if (isEdit && editActivity) {
        await fetch(`/api/activities/${editActivity.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const catData = CATEGORIES[category];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "500px",
          background: "#0d140d",
          borderRadius: "24px 24px 0 0",
          border: "1px solid #1e2e1e",
          borderBottom: "none",
          padding: "20px",
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>

        {/* Handle */}
        <div
          style={{
            width: "40px",
            height: "4px",
            background: "#1e3a1e",
            borderRadius: "2px",
            margin: "0 auto 20px",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#e8f5e9" }}>
            {isEdit ? "Edit Activity" : "Log Activity"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "#111811",
              border: "1px solid #1e2e1e",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#6b7c6b",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Step: Category selection */}
        {step === "category" && (
          <>
            <p style={{ color: "#4a5e4a", fontSize: "13px", marginBottom: "16px" }}>
              Choose a category to get started
            </p>
            {/* Category tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {(Object.keys(CATEGORIES) as CategoryKey[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    flex: 1,
                    padding: "10px 8px",
                    borderRadius: "12px",
                    border:
                      category === cat
                        ? `1px solid ${CATEGORIES[cat].color}66`
                        : "1px solid #1e2e1e",
                    background:
                      category === cat
                        ? CATEGORIES[cat].color + "18"
                        : "#111811",
                    color:
                      category === cat ? CATEGORIES[cat].color : "#4a5e4a",
                    fontSize: "12px",
                    fontWeight: category === cat ? 700 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>
                    {CATEGORIES[cat].emoji}
                  </span>
                  {CATEGORIES[cat].label}
                </button>
              ))}
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {CATEGORIES[category].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() =>
                    handleSelectOption(
                      opt as (typeof CATEGORIES.transport.options)[0]
                    )
                  }
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 16px",
                    background: "#111811",
                    border: "1px solid #1e2e1e",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = catData.color + "66";
                    e.currentTarget.style.background = catData.color + "10";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1e2e1e";
                    e.currentTarget.style.background = "#111811";
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#c8e6c9" }}>
                    {opt.label}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color:
                        opt.co2e === 0
                          ? "#00c853"
                          : opt.co2e < 2
                          ? "#69f0ae"
                          : opt.co2e < 5
                          ? "#ffcc02"
                          : "#ff5252",
                    }}
                  >
                    {opt.co2e === 0 ? "0 kg" : `~${opt.co2e} kg`}
                  </span>
                </button>
              ))}

              {/* Custom option */}
              <button
                onClick={() => {
                  setSelectedOption(null);
                  setDescription("");
                  setCo2e("");
                  setDistance("");
                  setStep("details");
                }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  background: "#111811",
                  border: "1px dashed #2a3a2a",
                  borderRadius: "12px",
                  cursor: "pointer",
                  color: "#4a5e4a",
                  fontSize: "14px",
                }}
              >
                <span>Custom Activity</span>
                <ChevronDown size={14} style={{ transform: "rotate(-90deg)" }} />
              </button>
            </div>
          </>
        )}

        {/* Step: Details */}
        {step === "details" && (
          <>
            {!isEdit && (
              <button
                onClick={() => setStep("category")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#00c853",
                  fontSize: "13px",
                  cursor: "pointer",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: 0,
                }}
              >
                ← Back
              </button>
            )}

            {/* Category selector for edit */}
            {isEdit && (
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    fontSize: "11px",
                    color: "#4a5e4a",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Category
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {(Object.keys(CATEGORIES) as CategoryKey[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "10px",
                        border:
                          category === cat
                            ? `1px solid ${CATEGORIES[cat].color}66`
                            : "1px solid #1e2e1e",
                        background:
                          category === cat
                            ? CATEGORIES[cat].color + "18"
                            : "#111811",
                        color:
                          category === cat
                            ? CATEGORIES[cat].color
                            : "#4a5e4a",
                        fontSize: "11px",
                        fontWeight: category === cat ? 700 : 400,
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {CATEGORIES[cat].emoji} {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "11px",
                  color: "#4a5e4a",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Description
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Morning bike ride..."
                style={{
                  width: "100%",
                  background: "#0d140d",
                  border: "1px solid #1e2e1e",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  color: "#e8f5e9",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#00c853")}
                onBlur={(e) => (e.target.style.borderColor = "#1e2e1e")}
              />
            </div>

            {/* Distance (if applicable) */}
            {(selectedOption && "hasDistance" in selectedOption && (selectedOption as { hasDistance?: boolean }).hasDistance) && (
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    fontSize: "11px",
                    color: "#4a5e4a",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Distance (km)
                  {"perKm" in selectedOption && (selectedOption as { perKm?: number }).perKm ? (
                    <span style={{ color: "#2a3a2a", fontWeight: 400, marginLeft: "6px" }}>
                      · auto-calculates CO₂e
                    </span>
                  ) : null}
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="0"
                  min={0}
                  step={0.1}
                  style={{
                    width: "100%",
                    background: "#0d140d",
                    border: "1px solid #1e2e1e",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    color: "#e8f5e9",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#00c853")}
                  onBlur={(e) => (e.target.style.borderColor = "#1e2e1e")}
                />
              </div>
            )}

            {/* CO2e */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontSize: "11px",
                  color: "#4a5e4a",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                CO₂e Emissions (kg)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  value={co2e}
                  onChange={(e) => setCo2e(e.target.value)}
                  placeholder="0.0"
                  min={0}
                  step={0.1}
                  style={{
                    width: "100%",
                    background: "#0d140d",
                    border: "1px solid #1e2e1e",
                    borderRadius: "10px",
                    padding: "12px 54px 12px 14px",
                    color: "#00c853",
                    fontSize: "18px",
                    fontWeight: 700,
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#00c853")}
                  onBlur={(e) => (e.target.style.borderColor = "#1e2e1e")}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#4a5e4a",
                    fontSize: "12px",
                    pointerEvents: "none",
                  }}
                >
                  kg CO₂e
                </span>
              </div>

              {/* Impact indicator */}
              {co2e !== "" && (
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      height: "4px",
                      flex: 1,
                      background: "#1a2a1a",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min((Number(co2e) / 10) * 100, 100)}%`,
                        background:
                          Number(co2e) === 0
                            ? "#00c853"
                            : Number(co2e) < 2
                            ? "#69f0ae"
                            : Number(co2e) < 5
                            ? "#ffcc02"
                            : "#ff5252",
                        borderRadius: "2px",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      color:
                        Number(co2e) === 0
                          ? "#00c853"
                          : Number(co2e) < 2
                          ? "#69f0ae"
                          : Number(co2e) < 5
                          ? "#ffcc02"
                          : "#ff5252",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {Number(co2e) === 0
                      ? "Zero emission!"
                      : Number(co2e) < 2
                      ? "Low impact"
                      : Number(co2e) < 5
                      ? "Moderate"
                      : "High impact"}
                  </span>
                </div>
              )}
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving || !description || co2e === ""}
              style={{
                width: "100%",
                background:
                  saving || !description || co2e === ""
                    ? "#1a2a1a"
                    : "linear-gradient(135deg, #00c853, #00963e)",
                color:
                  saving || !description || co2e === "" ? "#4a5e4a" : "#fff",
                border: "none",
                borderRadius: "14px",
                padding: "16px",
                fontSize: "16px",
                fontWeight: 700,
                cursor:
                  saving || !description || co2e === ""
                    ? "not-allowed"
                    : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s",
                boxShadow:
                  !saving && description && co2e !== ""
                    ? "0 4px 20px rgba(0,200,83,0.3)"
                    : "none",
              }}
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Check size={18} />
                  {isEdit ? "Update Activity" : "Log Activity"}
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
