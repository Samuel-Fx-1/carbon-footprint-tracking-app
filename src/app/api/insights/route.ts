import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { activities, users } from "@/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId") ?? "1");

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const monthlyRaw = await db
    .select({
      date: sql<string>`DATE(${activities.loggedAt})`,
      total: sql<number>`SUM(${activities.co2e})`,
      category: activities.category,
    })
    .from(activities)
    .where(
      and(eq(activities.userId, userId), gte(activities.loggedAt, thirtyDaysAgo))
    )
    .groupBy(sql`DATE(${activities.loggedAt})`, activities.category)
    .orderBy(sql`DATE(${activities.loggedAt})`);

  // Build 30-day map
  const dailyMap: Record<
    string,
    { transport: number; food: number; lifestyle: number; total: number }
  > = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dailyMap[key] = { transport: 0, food: 0, lifestyle: 0, total: 0 };
  }

  for (const row of monthlyRaw) {
    if (dailyMap[row.date]) {
      dailyMap[row.date][row.category] += Number(row.total);
      dailyMap[row.date].total += Number(row.total);
    }
  }

  const dailyData = Object.entries(dailyMap).map(([date, vals]) => ({
    date,
    day: new Date(date + "T12:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    total: Math.round(vals.total * 10) / 10,
    transport: Math.round(vals.transport * 10) / 10,
    food: Math.round(vals.food * 10) / 10,
    lifestyle: Math.round(vals.lifestyle * 10) / 10,
  }));

  // Category totals
  const categoryTotals = await db
    .select({
      category: activities.category,
      total: sql<number>`SUM(${activities.co2e})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(activities)
    .where(
      and(eq(activities.userId, userId), gte(activities.loggedAt, thirtyDaysAgo))
    )
    .groupBy(activities.category);

  // Average daily
  const totalAll = dailyData.reduce((s, d) => s + d.total, 0);
  const daysWithData = dailyData.filter((d) => d.total > 0).length;
  const avgDaily = daysWithData > 0 ? Math.round((totalAll / daysWithData) * 10) / 10 : 0;

  // Best day (lowest non-zero)
  const nonZeroDays = dailyData.filter((d) => d.total > 0);
  const bestDay = nonZeroDays.reduce(
    (best, d) => (d.total < best.total ? d : best),
    nonZeroDays[0] ?? { day: "N/A", total: 0 }
  );

  // Streak calculation
  let streak = 0;
  for (let i = dailyData.length - 1; i >= 0; i--) {
    if (dailyData[i].total > 0 && dailyData[i].total <= user.dailyTarget) {
      streak++;
    } else {
      break;
    }
  }

  return NextResponse.json({
    dailyData,
    categoryTotals,
    avgDaily,
    totalMonth: Math.round(totalAll * 10) / 10,
    bestDay,
    streak,
    dailyTarget: user.dailyTarget,
  });
}
