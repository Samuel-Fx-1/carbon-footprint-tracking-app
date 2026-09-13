import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, activities, challenges } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function POST() {
  try {
    // Check if already seeded
    const [{ value: userCount }] = await db
      .select({ value: count() })
      .from(users);

    if (Number(userCount) > 0) {
      const [user] = await db.select().from(users).limit(1);
      return NextResponse.json({ ok: true, userId: user.id, seeded: false });
    }

    // Create default user
    const [user] = await db
      .insert(users)
      .values({
        name: "Alex Green",
        email: "alex@ecotrack.app",
        dailyTarget: 20,
      })
      .returning();

    const now = new Date();
    const today = new Date(now);

    // Seed activities for the past 7 days
    const seedActivities = [];

    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);

      if (d === 0) {
        // Today's activities
        seedActivities.push(
          {
            userId: user.id,
            category: "transport" as const,
            activityType: "Bike",
            description: "Bike to Work",
            co2e: 0.0,
            distance: 8.5,
            unit: "km",
            loggedAt: new Date(date.setHours(8, 30)),
          },
          {
            userId: user.id,
            category: "food" as const,
            activityType: "Food",
            description: "Veggie Breakfast",
            co2e: 0.8,
            distance: null,
            unit: null,
            loggedAt: new Date(date.setHours(9, 0)),
          },
          {
            userId: user.id,
            category: "transport" as const,
            activityType: "Bus",
            description: "Bus Ride Downtown",
            co2e: 1.2,
            distance: 5.2,
            unit: "km",
            loggedAt: new Date(date.setHours(12, 15)),
          },
          {
            userId: user.id,
            category: "food" as const,
            activityType: "Food",
            description: "Veggie Dinner",
            co2e: 1.5,
            distance: null,
            unit: null,
            loggedAt: new Date(date.setHours(19, 0)),
          },
          {
            userId: user.id,
            category: "lifestyle" as const,
            activityType: "Energy",
            description: "Home Energy Usage",
            co2e: 3.2,
            distance: null,
            unit: null,
            loggedAt: new Date(date.setHours(20, 0)),
          },
          {
            userId: user.id,
            category: "lifestyle" as const,
            activityType: "Shopping",
            description: "Online Shopping",
            co2e: 2.1,
            distance: null,
            unit: null,
            loggedAt: new Date(date.setHours(21, 0)),
          },
          {
            userId: user.id,
            category: "transport" as const,
            activityType: "Car",
            description: "Drive to Gym",
            co2e: 2.8,
            distance: 6.0,
            unit: "km",
            loggedAt: new Date(date.setHours(17, 30)),
          },
          {
            userId: user.id,
            category: "food" as const,
            activityType: "Food",
            description: "Chicken Lunch",
            co2e: 2.6,
            distance: null,
            unit: null,
            loggedAt: new Date(date.setHours(13, 0)),
          }
        );
      } else {
        // Historical days
        const transportCo2 = Math.round((Math.random() * 6 + 1) * 10) / 10;
        const foodCo2 = Math.round((Math.random() * 5 + 1) * 10) / 10;
        const lifestyleCo2 = Math.round((Math.random() * 4 + 1) * 10) / 10;

        seedActivities.push(
          {
            userId: user.id,
            category: "transport" as const,
            activityType: d % 2 === 0 ? "Car" : "Bus",
            description: d % 2 === 0 ? "Drive to Office" : "Bus Commute",
            co2e: transportCo2,
            distance: Math.round(Math.random() * 20 + 5),
            unit: "km",
            loggedAt: new Date(new Date(date).setHours(9, 0)),
          },
          {
            userId: user.id,
            category: "food" as const,
            activityType: "Food",
            description: d % 3 === 0 ? "Beef Burger" : "Salad Bowl",
            co2e: foodCo2,
            distance: null,
            unit: null,
            loggedAt: new Date(new Date(date).setHours(13, 0)),
          },
          {
            userId: user.id,
            category: "lifestyle" as const,
            activityType: "Energy",
            description: "Home Energy",
            co2e: lifestyleCo2,
            distance: null,
            unit: null,
            loggedAt: new Date(new Date(date).setHours(20, 0)),
          }
        );
      }
    }

    await db.insert(activities).values(seedActivities);

    // Seed challenges
    await db.insert(challenges).values([
      {
        title: "Zero Car Week",
        description: "Avoid car travel for 7 days",
        targetCo2e: 5,
        durationDays: 7,
        isActive: true,
      },
      {
        title: "Plant-Based Month",
        description: "Eat only plant-based meals for 30 days",
        targetCo2e: 30,
        durationDays: 30,
        isActive: true,
      },
      {
        title: "Energy Saver",
        description: "Reduce home energy by 20% this week",
        targetCo2e: 15,
        durationDays: 7,
        isActive: true,
      },
      {
        title: "Bike Commuter",
        description: "Cycle to work 5 days in a row",
        targetCo2e: 2,
        durationDays: 5,
        isActive: true,
      },
    ]);

    return NextResponse.json({ ok: true, userId: user.id, seeded: true });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
