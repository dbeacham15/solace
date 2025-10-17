export interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
}

export type SortField = 'firstName' | 'lastName' | 'city' | 'degree' | 'yearsOfExperience';
export type SortDirection = 'asc' | 'desc' | null;

export interface FilterState {
  nameSearch: string;
  selectedCities: string[];
  selectedDegrees: string[];
  selectedSpecialties: string[];
  minExperience: number | null;
  maxExperience: number | null;
}

export interface SortState {
  sortField: SortField | null;
  sortDirection: SortDirection;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}

export interface ExperienceRange {
  min: number;
  max: number;
}
