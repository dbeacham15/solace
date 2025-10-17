export interface AdvocatesQueryParams {
  page?: string;
  limit?: string;
  sortField?: 'firstName' | 'lastName' | 'city' | 'degree' | 'yearsOfExperience';
  sortDirection?: 'asc' | 'desc';
  nameSearch?: string;
  cities?: string; // comma-separated list
  degrees?: string; // comma-separated list
  specialties?: string; // comma-separated list
  minExperience?: string;
  maxExperience?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
