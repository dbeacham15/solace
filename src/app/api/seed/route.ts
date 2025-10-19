import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { sql } from "drizzle-orm";

export async function POST() {
  // SECURITY: Only allow seeding in development/staging environments
  if (process.env.NODE_ENV === "production") {
    return Response.json(
      { error: "Forbidden: Seed endpoint is disabled in production" },
      { status: 403 }
    );
  }

  if (!db) {
    return Response.json(
      { error: "Database not configured. Please set DATABASE_URL environment variable." },
      { status: 500 }
    );
  }

  try {
    // Clear existing data before seeding (idempotent operation)
    await db.execute(sql`TRUNCATE TABLE advocates RESTART IDENTITY CASCADE`);

    // Insert seed data
    const records = await db.insert(advocates).values(advocateData).returning();

    return Response.json({
      message: "Database seeded successfully",
      count: records.length,
      advocates: records
    });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to seed database" },
      { status: 500 }
    );
  }
}
