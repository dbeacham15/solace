import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Advocate, SortField, SortDirection } from "@/types/advocate";

interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

interface ApiResponse {
  data: Advocate[];
  pagination: PaginationData;
  filters?: Record<string, string>;
  sort?: { field: string; direction: string };
}

interface AdvocateFilters {
  page: number;
  limit: number;
  search: string;
  city: string;
  degree: string;
  specialty: string;
  minYears: string;
  maxYears: string;
  sortBy: SortField | null;
  sortDir: SortDirection;
}

// Build query string from filters
function buildQueryString(filters: AdvocateFilters): string {
  const params = new URLSearchParams();

  params.append("page", filters.page.toString());
  params.append("limit", filters.limit.toString());

  if (filters.search) params.append("search", filters.search);
  if (filters.city) params.append("city", filters.city);
  if (filters.degree) params.append("degree", filters.degree);
  if (filters.specialty) params.append("specialty", filters.specialty);
  if (filters.minYears) params.append("minYears", filters.minYears);
  if (filters.maxYears) params.append("maxYears", filters.maxYears);
  if (filters.sortBy) {
    params.append("sortBy", filters.sortBy);
    params.append("sortDir", filters.sortDir);
  }

  return params.toString();
}

// Fetch advocates from API
async function fetchAdvocates(filters: AdvocateFilters): Promise<ApiResponse> {
  const queryString = buildQueryString(filters);
  const response = await fetch(`/api/advocates?${queryString}`);

  if (!response.ok) {
    throw new Error("Failed to fetch advocates");
  }

  return response.json();
}

// React Query hook for advocates data
export function useAdvocates(filters: AdvocateFilters) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["advocates", filters],
    queryFn: () => fetchAdvocates(filters),
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep old data while fetching new (optimistic feel)
    placeholderData: (previousData) => previousData,
  });

  // Prefetch next page for instant navigation
  const prefetchNextPage = () => {
    if (query.data?.pagination.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["advocates", { ...filters, page: filters.page + 1 }],
        queryFn: () => fetchAdvocates({ ...filters, page: filters.page + 1 }),
      });
    }
  };

  // Prefetch previous page
  const prefetchPrevPage = () => {
    if (filters.page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["advocates", { ...filters, page: filters.page - 1 }],
        queryFn: () => fetchAdvocates({ ...filters, page: filters.page - 1 }),
      });
    }
  };

  return {
    ...query,
    advocates: query.data?.data || [],
    pagination: query.data?.pagination || null,
    prefetchNextPage,
    prefetchPrevPage,
  };
}

// Hook for unique values (cities, degrees, specialties)
export function useUniqueValues() {
  return useQuery({
    queryKey: ["advocates", "unique-values"],
    queryFn: async () => {
      const response = await fetch("/api/advocates?limit=1000");
      if (!response.ok) throw new Error("Failed to fetch unique values");

      const json: ApiResponse = await response.json();
      const data = json.data || [];

      return {
        cities: Array.from(new Set(data.map(a => a.city))).sort(),
        degrees: Array.from(new Set(data.map(a => a.degree))).sort(),
        specialties: Array.from(new Set(data.flatMap(a => a.specialties))).sort(),
      };
    },
    // Cache unique values for 10 minutes (they rarely change)
    staleTime: 10 * 60 * 1000,
  });
}
