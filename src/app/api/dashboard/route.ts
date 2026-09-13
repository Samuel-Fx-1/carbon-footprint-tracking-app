import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { activities, users } from "@/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId") ?? "1");

  // Get user
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Today's range
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Today's activities
  const todayActivities = await db
    .select()
    .from(activities)
    .where(
      and(
        eq(activities.userId, userId),
        gte(activities.loggedAt, todayStart),
        lte(activities.loggedAt, todayEnd)
      )
    )
    .orderBy(activities.loggedAt);

  // Total today
  const todayTotal = todayActivities.reduce((sum, a) => sum + a.co2e, 0);

  // Breakdown by category
  const breakdown = {
    transport: 0,
    food: 0,
    lifestyle: 0,
  };
  for (const a of todayActivities) {
    breakdown[a.category] += a.co2e;
  }

  // Weekly data (last 7 days)
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const weeklyRaw = await db
    .select({
      date: sql<string>`DATE(${activities.loggedAt})`,
      total: sql<number>`SUM(${activities.co2e})`,
      category: activities.category,
    })
    .from(activities)
    .where(
      and(
        eq(activities.userId, userId),
        gte(activities.loggedAt, weekStart)
      )
    )
    .groupBy(sql`DATE(${activities.loggedAt})`, activities.category)
    .orderBy(sql`DATE(${activities.loggedAt})`);

  // Build weekly chart data
  const weeklyMap: Record<string, { transport: number; food: number; lifestyle: number; total: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    weeklyMap[key] = { transport: 0, food: 0, lifestyle: 0, total: 0 };
  }

  for (const row of weeklyRaw) {
    const key = row.date;
    if (weeklyMap[key]) {
      weeklyMap[key][row.category] += Number(row.total);
      weeklyMap[key].total += Number(row.total);
    }
  }

  const weeklyData = Object.entries(weeklyMap).map(([date, vals]) => ({
    date,
    day: new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }),
    ...vals,
    total: Math.round(vals.total * 10) / 10,
    transport: Math.round(vals.transport * 10) / 10,
    food: Math.round(vals.food * 10) / 10,
    lifestyle: Math.round(vals.lifestyle * 10) / 10,
  }));

  // Recent 5 activities
  const recent = await db
    .select()
    .from(activities)
    .where(eq(activities.userId, userId))
    .orderBy(sql`${activities.loggedAt} DESC`)
    .limit(5);

  return NextResponse.json({
    user,
    todayTotal: Math.round(todayTotal * 10) / 10,
    dailyTarget: user.dailyTarget,
    breakdown: {
      transport: Math.round(breakdown.transport * 10) / 10,
      food: Math.round(breakdown.food * 10) / 10,
      lifestyle: Math.round(breakdown.lifestyle * 10) / 10,
    },
    weeklyData,
    recentActivities: recent,
    todayActivities,
  });
}
