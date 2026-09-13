"use client";

import {
  Bike,
  Bus,
  Car,
  Plane,
  Train,
  Utensils,
  Leaf,
  ShoppingBag,
  Zap,
  Home,
  Tv,
  Droplets,
  Beef,
  Salad,
  Coffee,
  Package,
  Ship,
  Footprints,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  bike: Bike,
  bicycle: Bike,
  bus: Bus,
  car: Car,
  plane: Plane,
  flight: Plane,
  train: Train,
  metro: Train,
  subway: Train,
  food: Utensils,
  veggie: Salad,
  vegetarian: Salad,
  vegan: Leaf,
  beef: Beef,
  chicken: Utensils,
  lunch: Utensils,
  dinner: Utensils,
  breakfast: Coffee,
  coffee: Coffee,
  shopping: ShoppingBag,
  energy: Zap,
  electricity: Zap,
  home: Home,
  house: Home,
  streaming: Tv,
  tv: Tv,
  water: Droplets,
  delivery: Package,
  ship: Ship,
  walk: Footprints,
  walking: Footprints,
};

function getIcon(type: string): React.ElementType {
  const lower = type.toLowerCase();
  for (const [key, Icon] of Object.entries(iconMap)) {
    if (lower.includes(key)) return Icon;
  }
  return Leaf;
}

const categoryColors: Record<string, string> = {
  transport: "#2196f3",
  food: "#ff9800",
  lifestyle: "#9c27b0",
};

const categoryBg: Record<string, string> = {
  transport: "rgba(33,150,243,0.12)",
  food: "rgba(255,152,0,0.12)",
  lifestyle: "rgba(156,39,176,0.12)",
};

interface ActivityIconProps {
  type: string;
  category: string;
  size?: number;
}

export default function ActivityIcon({
  type,
  category,
  size = 40,
}: ActivityIconProps) {
  const Icon = getIcon(type);
  const color = categoryColors[category] ?? "#00c853";
  const bg = categoryBg[category] ?? "rgba(0,200,83,0.12)";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "12px",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={size * 0.5} color={color} strokeWidth={2} />
    </div>
  );
}
