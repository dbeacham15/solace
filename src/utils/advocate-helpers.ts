import { Advocate, ExperienceRange } from '@/types/advocate';

export function getUniqueValues<T>(array: T[]): T[] {
  return Array.from(new Set(array)).sort();
}

export function getUniqueCities(advocates: Advocate[]): string[] {
  return getUniqueValues(advocates.map(a => a.city));
}

export function getUniqueDegrees(advocates: Advocate[]): string[] {
  return getUniqueValues(advocates.map(a => a.degree));
}

export function getUniqueSpecialties(advocates: Advocate[]): string[] {
  return getUniqueValues(advocates.flatMap(a => a.specialties));
}

export function getExperienceRange(advocates: Advocate[]): ExperienceRange {
  if (advocates.length === 0) {
    return { min: 0, max: 20 };
  }

  const years = advocates.map(a => a.yearsOfExperience);
  return {
    min: Math.min(...years),
    max: Math.max(...years)
  };
}

export function paginateData<T>(data: T[], currentPage: number, itemsPerPage: number): T[] {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
}

export function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  return Math.ceil(totalItems / itemsPerPage);
}
