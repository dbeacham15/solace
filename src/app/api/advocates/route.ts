import { NextRequest } from 'next/server';
import { sql, and, or, gte, lte, ilike, SQL, count } from 'drizzle-orm';
import db from '../../../db';
import { advocates } from '../../../db/schema';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse pagination params
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;

  // Parse sorting params
  const sortField = searchParams.get('sortField') as 'firstName' | 'lastName' | 'city' | 'degree' | 'yearsOfExperience' | null;
  const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' | null;

  // Parse filter params
  const nameSearch = searchParams.get('nameSearch');
  const cities = searchParams.get('cities')?.split(',').filter(Boolean);
  const degrees = searchParams.get('degrees')?.split(',').filter(Boolean);
  const specialties = searchParams.get('specialties')?.split(',').filter(Boolean);
  const minExperience = searchParams.get('minExperience');
  const maxExperience = searchParams.get('maxExperience');

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
  if (specialties && specialties.length > 0) {
    whereConditions.push(
      sql`${advocates.specialties} ?| array[${sql.join(specialties.map(s => sql.raw(`'${s}'`)), sql`, `)}]`
    );
  }

  // Years of experience filter
  if (minExperience) {
    whereConditions.push(gte(advocates.yearsOfExperience, parseInt(minExperience, 10)));
  }
  if (maxExperience) {
    whereConditions.push(lte(advocates.yearsOfExperience, parseInt(maxExperience, 10)));
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
