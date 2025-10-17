import db from "../../../db";
import { advocates } from "../../../db/schema";
import { and, or, gte, lte, eq, sql, asc, desc } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";

// Input validation schema
const querySchema = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10), // Max 100 per page
  search: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  degree: z.string().max(50).optional(),
  specialty: z.string().max(200).optional(),
  minYears: z.coerce.number().int().min(0).max(100).optional(),
  maxYears: z.coerce.number().int().min(0).max(100).optional(),
  sortBy: z.enum(["firstName", "lastName", "city", "yearsOfExperience"]).optional(),
  sortDir: z.enum(["asc", "desc"]).default("asc"),
});

type QueryParams = z.infer<typeof querySchema>;

export async function GET(request: NextRequest) {
  try {
    // Database check
    if (!db) {
      return Response.json(
        { error: "Service unavailable" },
        { status: 503 }
      );
    }

    const searchParams = request.nextUrl.searchParams;

    // Validate and sanitize input
    // Convert null to undefined for optional fields
    let validatedParams: QueryParams;
    try {
      validatedParams = querySchema.parse({
        page: searchParams.get("page") || undefined,
        limit: searchParams.get("limit") || undefined,
        search: searchParams.get("search") || undefined,
        city: searchParams.get("city") || undefined,
        degree: searchParams.get("degree") || undefined,
        specialty: searchParams.get("specialty") || undefined,
        minYears: searchParams.get("minYears") || undefined,
        maxYears: searchParams.get("maxYears") || undefined,
        sortBy: searchParams.get("sortBy") || undefined,
        sortDir: searchParams.get("sortDir") || undefined,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          {
            error: "Invalid request parameters",
            details: error.issues.map((e: z.ZodIssue) => ({
              field: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }
      throw error;
    }

    const { page, limit, search, city, degree, specialty, minYears, maxYears, sortBy, sortDir } = validatedParams;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    // Search term - searches across multiple fields (case-insensitive)
    // Sanitized by Zod schema (max 200 chars)
    if (search) {
      const searchLower = search.toLowerCase();
      // Escape special characters for SQL LIKE
      const escapedSearch = searchLower.replace(/[%_]/g, "\\$&");

      conditions.push(
        or(
          sql`LOWER(${advocates.firstName}) LIKE ${`%${escapedSearch}%`}`,
          sql`LOWER(${advocates.lastName}) LIKE ${`%${escapedSearch}%`}`,
          sql`LOWER(${advocates.city}) LIKE ${`%${escapedSearch}%`}`,
          sql`LOWER(${advocates.degree}) LIKE ${`%${escapedSearch}%`}`,
          sql`CAST(${advocates.yearsOfExperience} AS TEXT) LIKE ${`%${search}%`}`
        )
      );
    }

    // Exact match filters
    if (city) {
      conditions.push(eq(advocates.city, city));
    }

    if (degree) {
      conditions.push(eq(advocates.degree, degree));
    }

    // Specialty filter (JSONB contains)
    if (specialty) {
      conditions.push(sql`${advocates.specialties} @> ${JSON.stringify([specialty])}`);
    }

    // Years of experience range (already validated as numbers by Zod)
    if (minYears !== undefined) {
      conditions.push(gte(advocates.yearsOfExperience, minYears));
    }

    if (maxYears !== undefined) {
      conditions.push(lte(advocates.yearsOfExperience, maxYears));
    }

    // Build query
    let query = db.select().from(advocates);

    // Apply where clause if conditions exist
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    // Apply sorting
    if (sortBy) {
      const column = advocates[sortBy];
      query = query.orderBy(sortDir === "desc" ? desc(column) : asc(column)) as typeof query;
    } else {
      // Default sort by id
      query = query.orderBy(asc(advocates.id)) as typeof query;
    }

    // Get total count for pagination (before limit/offset)
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(advocates);
    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }
    const [{ count: totalCount }] = await countQuery;

    // Apply pagination
    query = query.limit(limit).offset(offset) as typeof query;

    // Execute query
    const data = await query;

    return Response.json({
      data,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page * limit < totalCount,
      },
      filters: {
        search: search || undefined,
        city: city || undefined,
        degree: degree || undefined,
        specialty: specialty || undefined,
        minYears: minYears !== undefined ? minYears : undefined,
        maxYears: maxYears !== undefined ? maxYears : undefined,
      },
      sort: sortBy ? { field: sortBy, direction: sortDir } : undefined,
    });

  } catch (error) {
    // Log detailed error for debugging
    console.error("Error fetching advocates:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Return sanitized error response (don't leak implementation details)
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
