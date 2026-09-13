import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId") ?? "1");
  const dateFrom = searchParams.get("from");
  const dateTo = searchParams.get("to");

  const conditions = [eq(activities.userId, userId)];

  if (dateFrom) {
    conditions.push(gte(activities.loggedAt, new Date(dateFrom)));
  }
  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    conditions.push(lte(activities.loggedAt, to));
  }

  const rows = await db
    .select()
    .from(activities)
    .where(and(...conditions))
    .orderBy(desc(activities.loggedAt))
    .limit(100);

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    userId = 1,
    category,
    activityType,
    description,
    co2e,
    distance,
    unit,
    loggedAt,
  } = body;

  if (!category || !activityType || !description || co2e === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [created] = await db
    .insert(activities)
    .values({
      userId,
      category,
      activityType,
      description,
      co2e: Number(co2e),
      distance: distance ? Number(distance) : null,
      unit: unit ?? null,
      loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
