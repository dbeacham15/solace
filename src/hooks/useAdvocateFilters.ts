import { useState, useEffect } from 'react';
import { FilterState } from '@/types/advocate';

export function useAdvocateFilters() {
  const [nameSearch, setNameSearch] = useState("");
  const [nameSearchImmediate, setNameSearchImmediate] = useState(""); // For input value
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [minExperience, setMinExperience] = useState<number | null>(null);
  const [maxExperience, setMaxExperience] = useState<number | null>(null);

  // Debounce name search - delay API call by 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setNameSearch(nameSearchImmediate);
    }, 500);

    return () => clearTimeout(timer);
  }, [nameSearchImmediate]);

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
    setNameSearchImmediate("");
    setSelectedCities([]);
    setSelectedDegrees([]);
    setSelectedSpecialties([]);
    setMinExperience(null);
    setMaxExperience(null);
  };

  return {
    filters,
    hasActiveFilters,
    nameSearch: nameSearchImmediate, // Return immediate value for input
    setNameSearch: setNameSearchImmediate, // Set immediate value on input change
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
