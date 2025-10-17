/**
 * Input sanitization utilities for API endpoints
 */

/**
 * Sanitizes a string to prevent SQL injection by removing special characters
 * Allows only alphanumeric characters, spaces, hyphens, and apostrophes
 */
export function sanitizeString(input: string): string {
  // Remove any characters that aren't alphanumeric, space, hyphen, or apostrophe
  return input.replace(/[^a-zA-Z0-9\s'-]/g, '');
}

/**
 * Sanitizes an array of strings
 */
export function sanitizeStringArray(input: string[]): string[] {
  return input.map(sanitizeString).filter(s => s.length > 0);
}

/**
 * Validates and bounds pagination parameters
 */
export function validatePaginationParams(page: number, limit: number): { page: number; limit: number } {
  // Ensure page is at least 1
  const validPage = Math.max(1, isNaN(page) ? 1 : page);

  // Limit items per page to reasonable bounds (1-100)
  const validLimit = Math.min(100, Math.max(1, isNaN(limit) ? 10 : limit));

  return { page: validPage, limit: validLimit };
}

/**
 * Validates and bounds experience range parameters
 */
export function validateExperienceRange(min: string | null, max: string | null): { min: number | null; max: number | null } {
  const minValue = min ? parseInt(min, 10) : null;
  const maxValue = max ? parseInt(max, 10) : null;

  // Ensure values are non-negative and reasonable (0-100 years)
  const validMin = minValue !== null && !isNaN(minValue) ? Math.max(0, Math.min(100, minValue)) : null;
  const validMax = maxValue !== null && !isNaN(maxValue) ? Math.max(0, Math.min(100, maxValue)) : null;

  return { min: validMin, max: validMax };
}

/**
 * Validates sort field against allowed values
 */
export function validateSortField(field: string | null): 'firstName' | 'lastName' | 'city' | 'degree' | 'yearsOfExperience' | null {
  const allowedFields = ['firstName', 'lastName', 'city', 'degree', 'yearsOfExperience'];
  return field && allowedFields.includes(field) ? field as any : null;
}

/**
 * Validates sort direction against allowed values
 */
export function validateSortDirection(direction: string | null): 'asc' | 'desc' | null {
  return direction === 'asc' || direction === 'desc' ? direction : null;
}
