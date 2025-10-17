import { Advocate, FilterState } from '@/types/advocate';

export function filterAdvocatesByName(advocates: Advocate[], nameSearch: string): Advocate[] {
  if (nameSearch.trim() === '') return advocates;

  const searchLower = nameSearch.toLowerCase();
  return advocates.filter(advocate =>
    advocate.firstName.toLowerCase().includes(searchLower) ||
    advocate.lastName.toLowerCase().includes(searchLower)
  );
}

export function filterAdvocatesByCities(advocates: Advocate[], selectedCities: string[]): Advocate[] {
  if (selectedCities.length === 0) return advocates;
  return advocates.filter(advocate => selectedCities.includes(advocate.city));
}

export function filterAdvocatesByDegrees(advocates: Advocate[], selectedDegrees: string[]): Advocate[] {
  if (selectedDegrees.length === 0) return advocates;
  return advocates.filter(advocate => selectedDegrees.includes(advocate.degree));
}

export function filterAdvocatesBySpecialties(advocates: Advocate[], selectedSpecialties: string[]): Advocate[] {
  if (selectedSpecialties.length === 0) return advocates;
  return advocates.filter(advocate =>
    advocate.specialties.some(specialty => selectedSpecialties.includes(specialty))
  );
}

export function filterAdvocatesByExperience(
  advocates: Advocate[],
  minExperience: number | null,
  maxExperience: number | null
): Advocate[] {
  let filtered = advocates;

  if (minExperience !== null) {
    filtered = filtered.filter(advocate => advocate.yearsOfExperience >= minExperience);
  }

  if (maxExperience !== null) {
    filtered = filtered.filter(advocate => advocate.yearsOfExperience <= maxExperience);
  }

  return filtered;
}

export function applyAllFilters(advocates: Advocate[], filters: FilterState): Advocate[] {
  let filtered = advocates;

  filtered = filterAdvocatesByName(filtered, filters.nameSearch);
  filtered = filterAdvocatesByCities(filtered, filters.selectedCities);
  filtered = filterAdvocatesByDegrees(filtered, filters.selectedDegrees);
  filtered = filterAdvocatesBySpecialties(filtered, filters.selectedSpecialties);
  filtered = filterAdvocatesByExperience(filtered, filters.minExperience, filters.maxExperience);

  return filtered;
}
