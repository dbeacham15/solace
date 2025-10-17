import { NextRequest } from 'next/server';
import { sql, and, or, gte, lte, ilike, SQL, count } from 'drizzle-orm';
import db from '../../../db';
import { advocates } from '../../../db/schema';
import {
  sanitizeString,
  sanitizeStringArray,
  validatePaginationParams,
  validateExperienceRange,
  validateSortField,
  validateSortDirection,
} from '@/utils/input-sanitization';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse and validate pagination params
  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const rawLimit = parseInt(searchParams.get('limit') || '10', 10);
  const { page, limit } = validatePaginationParams(rawPage, rawLimit);
  const offset = (page - 1) * limit;

  // Parse and validate sorting params
  const sortField = validateSortField(searchParams.get('sortField'));
  const sortDirection = validateSortDirection(searchParams.get('sortDirection'));

  // Parse and sanitize filter params
  const rawNameSearch = searchParams.get('nameSearch');
  const nameSearch = rawNameSearch ? sanitizeString(rawNameSearch) : null;

  const rawCities = searchParams.get('cities')?.split(',').filter(Boolean);
  const cities = rawCities ? sanitizeStringArray(rawCities) : null;

  const rawDegrees = searchParams.get('degrees')?.split(',').filter(Boolean);
  const degrees = rawDegrees ? sanitizeStringArray(rawDegrees) : null;

  const rawSpecialties = searchParams.get('specialties')?.split(',').filter(Boolean);
  const specialties = rawSpecialties ? sanitizeStringArray(rawSpecialties) : null;

  const { min: minExperience, max: maxExperience } = validateExperienceRange(
    searchParams.get('minExperience'),
    searchParams.get('maxExperience')
  );

  // Build WHERE clause
  const whereConditions: SQL[] = [];

  // Name search (search in both first name and last name)
  if (nameSearch && nameSearch.trim() !== '') {
    whereConditions.push(
      or(
        ilike(advocates.firstName, `%${nameSearch}%`),
        ilike(advocates.lastName, `%${nameSearch}%`)
      )!
    );
  }

  // City filter
  if (cities && cities.length > 0) {
    whereConditions.push(
      sql`${advocates.city} = ANY(${cities})`
    );
  }

  // Degree filter
  if (degrees && degrees.length > 0) {
    whereConditions.push(
      sql`${advocates.degree} = ANY(${degrees})`
    );
  }

  // Specialties filter (check if any selected specialty exists in the JSONB array)
  // Using parameterized array binding to prevent SQL injection
  if (specialties && specialties.length > 0) {
    whereConditions.push(
      sql`${advocates.specialties} ?| ${specialties}`
    );
  }

  // Years of experience filter
  if (minExperience !== null) {
    whereConditions.push(gte(advocates.yearsOfExperience, minExperience));
  }
  if (maxExperience !== null) {
    whereConditions.push(lte(advocates.yearsOfExperience, maxExperience));
  }

  // Combine all WHERE conditions
  const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

  // Get total count for pagination
  const [{ total }] = await db
    .select({ total: count() })
    .from(advocates)
    .where(whereClause);

  // Build ORDER BY clause
  let orderByClause;
  if (sortField && sortDirection) {
    const column = advocates[sortField];
    orderByClause = sortDirection === 'asc' ? sql`${column} ASC` : sql`${column} DESC`;
  }

  // Execute main query with pagination
  const query = db
    .select()
    .from(advocates)
    .where(whereClause)
    .limit(limit)
    .offset(offset);

  if (orderByClause) {
    query.orderBy(orderByClause);
  }

  const data = await query;

  // Return paginated response
  return Response.json({
    data,
    pagination: {
      page,
      limit,
      total: Number(total),
      totalPages: Math.ceil(Number(total) / limit),
    },
  });
}
