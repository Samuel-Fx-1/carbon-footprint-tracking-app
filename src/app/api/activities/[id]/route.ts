import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { category, activityType, description, co2e, distance, unit } = body;

  const [updated] = await db
    .update(activities)
    .set({
      category,
      activityType,
      description,
      co2e: Number(co2e),
      distance: distance ? Number(distance) : null,
      unit: unit ?? null,
    })
    .where(eq(activities.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db.delete(activities).where(eq(activities.id, Number(id)));

  return NextResponse.json({ ok: true });
}
