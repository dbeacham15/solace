/**
 * Migration to fix JSONB storage issue
 * Converts string-stored specialties to proper JSONB arrays
 */
import { sql } from "drizzle-orm";
import db from "../index";

export async function fixJsonbStorage() {
  if (!db) {
    throw new Error("Database not available");
  }

  console.log("Starting JSONB storage fix migration...");

  try {
    // Check if data needs conversion
    const sampleData = await db.execute(
      sql`SELECT id, specialties, jsonb_typeof(specialties) as type FROM advocates LIMIT 1`
    );

    if (sampleData.length === 0) {
      console.log("No data to migrate");
      return;
    }

    const firstRow = sampleData[0] as { type: string };

    if (firstRow.type === "string") {
      console.log("Converting string specialties to JSONB arrays...");

      // Convert string to JSONB for all rows
      // The data is already in JSON string format like '["item1","item2"]'
      // We just need to cast it to JSONB
      await db.execute(
        sql`UPDATE advocates
            SET specialties = specialties::text::jsonb
            WHERE jsonb_typeof(specialties) = 'string'`
      );

      console.log("✓ Successfully converted specialties to JSONB");
    } else if (firstRow.type === "array") {
      console.log("✓ Specialties already stored as JSONB arrays");
    } else {
      console.warn(`⚠ Unexpected type: ${firstRow.type}`);
    }

    // Verify the conversion
    const verifyData = await db.execute(
      sql`SELECT COUNT(*) as count
          FROM advocates
          WHERE jsonb_typeof(specialties) != 'array'`
    );

    const nonArrayCount = (verifyData[0] as { count: string }).count;

    if (nonArrayCount === "0") {
      console.log("✓ Migration verified: All specialties are JSONB arrays");
    } else {
      console.error(`✗ Migration incomplete: ${nonArrayCount} rows still not arrays`);
    }

  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run migration if executed directly
if (require.main === module) {
  fixJsonbStorage()
    .then(() => {
      console.log("Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}
