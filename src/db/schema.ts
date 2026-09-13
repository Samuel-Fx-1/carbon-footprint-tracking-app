import {
  pgTable,
  serial,
  text,
  real,
  integer,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
  "transport",
  "food",
  "lifestyle",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Eco User"),
  email: text("email").notNull().unique(),
  dailyTarget: real("daily_target").notNull().default(20),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  category: categoryEnum("category").notNull(),
  activityType: text("activity_type").notNull(),
  description: text("description").notNull(),
  co2e: real("co2e").notNull(),
  distance: real("distance"),
  unit: text("unit").default("km"),
  loggedAt: timestamp("logged_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dailyGoals = pgTable("daily_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  targetKg: real("target_kg").notNull().default(20),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetCo2e: real("target_co2e").notNull(),
  durationDays: integer("duration_days").notNull().default(7),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  challengeId: integer("challenge_id")
    .notNull()
    .references(() => challenges.id),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  completed: boolean("completed").notNull().default(false),
});
