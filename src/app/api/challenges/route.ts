import { NextResponse } from "next/server";
import { db } from "@/db";
import { challenges } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select()
    .from(challenges)
    .where(eq(challenges.isActive, true));

  return NextResponse.json(rows);
}
