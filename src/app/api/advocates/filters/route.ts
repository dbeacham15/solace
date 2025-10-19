import db from "../../../../db";
import { advocates } from "../../../../db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Database check
    if (!db) {
      return Response.json(
        { error: "Service unavailable" },
        { status: 503 }
      );
    }

    // Get unique cities (sorted alphabetically)
    const citiesResult = await db
      .selectDistinct({ city: advocates.city })
      .from(advocates)
      .orderBy(advocates.city);

    // Get unique degrees (sorted alphabetically)
    const degreesResult = await db
      .selectDistinct({ degree: advocates.degree })
      .from(advocates)
      .orderBy(advocates.degree);

    // Get all advocates and extract unique specialties in-memory
    // This is more efficient than trying to unnest JSONB in SQL for this use case
    const allAdvocates = await db.select({ specialties: advocates.specialties }).from(advocates);

    const uniqueSpecialties = new Set<string>();
    allAdvocates.forEach(advocate => {
      if (Array.isArray(advocate.specialties)) {
        advocate.specialties.forEach((specialty: string) => {
          if (specialty) uniqueSpecialties.add(specialty);
        });
      }
    });

    return Response.json({
      cities: citiesResult.map(row => row.city).filter(Boolean),
      degrees: degreesResult.map(row => row.degree).filter(Boolean),
      specialties: Array.from(uniqueSpecialties).sort(),
    });

  } catch (error) {
    // Log detailed error for debugging
    console.error("Error fetching filter options:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Return sanitized error response
    return Response.json(
      {
        error: process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Disable caching for fresh data
