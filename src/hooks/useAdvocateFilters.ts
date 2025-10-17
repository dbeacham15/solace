import { useState } from 'react';
import { FilterState } from '@/types/advocate';

export function useAdvocateFilters() {
  const [nameSearch, setNameSearch] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [minExperience, setMinExperience] = useState<number | null>(null);
  const [maxExperience, setMaxExperience] = useState<number | null>(null);

  const filters: FilterState = {
    nameSearch,
    selectedCities,
    selectedDegrees,
    selectedSpecialties,
    minExperience,
    maxExperience,
  };

  const hasActiveFilters =
    nameSearch !== "" ||
    selectedCities.length > 0 ||
    selectedDegrees.length > 0 ||
    selectedSpecialties.length > 0 ||
    minExperience !== null ||
    maxExperience !== null;

  const resetFilters = () => {
    setNameSearch("");
    setSelectedCities([]);
    setSelectedDegrees([]);
    setSelectedSpecialties([]);
    setMinExperience(null);
    setMaxExperience(null);
  };

  return {
    filters,
    hasActiveFilters,
    nameSearch,
    setNameSearch,
    selectedCities,
    setSelectedCities,
    selectedDegrees,
    setSelectedDegrees,
    selectedSpecialties,
    setSelectedSpecialties,
    minExperience,
    setMinExperience,
    maxExperience,
    setMaxExperience,
    resetFilters,
  };
}
