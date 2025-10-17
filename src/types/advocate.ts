export interface Advocate {
  id?: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt?: string;
}

export type SortField = "firstName" | "lastName" | "city" | "yearsOfExperience";
export type SortDirection = "asc" | "desc";

export interface AdvocateFilters {
  searchTerm: string;
  city: string;
  degree: string;
  specialty: string;
  minYears: number;
  maxYears: number;
}
