import { useState, useEffect, useCallback } from 'react';
import { Advocate, FilterState, SortField, SortDirection } from '@/types/advocate';

interface UseAdvocatesParams {
  page: number;
  limit: number;
  sortField: SortField | null;
  sortDirection: SortDirection;
  filters: FilterState;
}

interface UseAdvocatesReturn {
  advocates: Advocate[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  totalPages: number;
  allCities: string[];
  allDegrees: string[];
  allSpecialties: string[];
  experienceRange: { min: number; max: number };
  refetch: () => void;
}

export function useAdvocates({
  page,
  limit,
  sortField,
  sortDirection,
  filters,
}: UseAdvocatesParams): UseAdvocatesReturn {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // For filter options, we'll need to fetch all unique values separately
  const [allCities, setAllCities] = useState<string[]>([]);
  const [allDegrees, setAllDegrees] = useState<string[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<string[]>([]);
  const [experienceRange, setExperienceRange] = useState({ min: 0, max: 20 });

  const fetchAdvocates = useCallback(() => {
    const abortController = new AbortController();
    setIsLoading(true);
    setError(null);

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (sortField && sortDirection) {
      params.append('sortField', sortField);
      params.append('sortDirection', sortDirection);
    }

    if (filters.nameSearch) {
      params.append('nameSearch', filters.nameSearch);
    }

    if (filters.selectedCities.length > 0) {
      params.append('cities', filters.selectedCities.join(','));
    }

    if (filters.selectedDegrees.length > 0) {
      params.append('degrees', filters.selectedDegrees.join(','));
    }

    if (filters.selectedSpecialties.length > 0) {
      params.append('specialties', filters.selectedSpecialties.join(','));
    }

    if (filters.minExperience !== null) {
      params.append('minExperience', filters.minExperience.toString());
    }

    if (filters.maxExperience !== null) {
      params.append('maxExperience', filters.maxExperience.toString());
    }

    fetch(`/api/advocates?${params.toString()}`, {
      signal: abortController.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setTotalCount(jsonResponse.pagination.total);
        setTotalPages(jsonResponse.pagination.totalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        // Don't set error state if request was aborted (component unmounted or new request started)
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        console.error("Error fetching advocates:", error);
        setError(error);
        setIsLoading(false);
      });

    // Return cleanup function to abort fetch on unmount or new request
    return () => {
      abortController.abort();
    };
  }, [
    page,
    limit,
    sortField,
    sortDirection,
    filters.nameSearch,
    JSON.stringify(filters.selectedCities),
    JSON.stringify(filters.selectedDegrees),
    JSON.stringify(filters.selectedSpecialties),
    filters.minExperience,
    filters.maxExperience,
  ]);

  // Fetch filter options on mount
  useEffect(() => {
    // Fetch all advocates without filters to get unique values
    fetch('/api/advocates?limit=1000')
      .then((response) => response.json())
      .then((jsonResponse) => {
        const allAdvocates = jsonResponse.data;

        // Extract unique cities
        const cities = new Set(allAdvocates.map((a: Advocate) => a.city));
        setAllCities(Array.from(cities).sort() as string[]);

        // Extract unique degrees
        const degrees = new Set(allAdvocates.map((a: Advocate) => a.degree));
        setAllDegrees(Array.from(degrees).sort() as string[]);

        // Extract unique specialties
        const specialties = new Set(allAdvocates.flatMap((a: Advocate) => a.specialties));
        setAllSpecialties(Array.from(specialties).sort() as string[]);

        // Get experience range
        if (allAdvocates.length > 0) {
          const years = allAdvocates.map((a: Advocate) => a.yearsOfExperience);
          setExperienceRange({
            min: Math.min(...years),
            max: Math.max(...years),
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching filter options:", error);
      });
  }, []);

  useEffect(() => {
    const cleanup = fetchAdvocates();
    return cleanup;
  }, [fetchAdvocates]);

  return {
    advocates,
    isLoading,
    error,
    totalCount,
    totalPages,
    allCities,
    allDegrees,
    allSpecialties,
    experienceRange,
    refetch: fetchAdvocates,
  };
}
