import { Badge } from '@/components';
import { FilterState, ExperienceRange } from '@/types/advocate';

interface ActiveFiltersProps {
  filters: FilterState;
  experienceRange: ExperienceRange;
  onRemoveNameFilter: () => void;
  onRemoveCityFilter: (city: string) => void;
  onRemoveDegreeFilter: (degree: string) => void;
  onRemoveSpecialtyFilter: (specialty: string) => void;
  onRemoveExperienceFilter: () => void;
}

export function ActiveFilters({
  filters,
  experienceRange,
  onRemoveNameFilter,
  onRemoveCityFilter,
  onRemoveDegreeFilter,
  onRemoveSpecialtyFilter,
  onRemoveExperienceFilter,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    filters.nameSearch !== "" ||
    filters.selectedCities.length > 0 ||
    filters.selectedDegrees.length > 0 ||
    filters.selectedSpecialties.length > 0 ||
    filters.minExperience !== null ||
    filters.maxExperience !== null;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-healthcare-neutral-600 font-medium">Active filters:</span>

      {filters.nameSearch !== "" && (
        <Badge
          variant="neutral"
          size="sm"
          onClick={onRemoveNameFilter}
          aria-label={`Remove name filter: ${filters.nameSearch}`}
        >
          Name: &quot;{filters.nameSearch}&quot; ×
        </Badge>
      )}

      {filters.selectedCities.map(city => (
        <Badge
          key={`city-${city}`}
          variant="primary"
          size="sm"
          onClick={() => onRemoveCityFilter(city)}
          aria-label={`Remove city filter: ${city}`}
        >
          {city} ×
        </Badge>
      ))}

      {filters.selectedDegrees.map(degree => (
        <Badge
          key={`degree-${degree}`}
          variant="primary"
          size="sm"
          onClick={() => onRemoveDegreeFilter(degree)}
          aria-label={`Remove credential filter: ${degree}`}
        >
          {degree} ×
        </Badge>
      ))}

      {filters.selectedSpecialties.map(specialty => (
        <Badge
          key={`specialty-${specialty}`}
          variant="secondary"
          size="sm"
          onClick={() => onRemoveSpecialtyFilter(specialty)}
          aria-label={`Remove specialty filter: ${specialty}`}
        >
          {specialty} ×
        </Badge>
      ))}

      {(filters.minExperience !== null || filters.maxExperience !== null) && (
        <Badge
          variant="accent"
          size="sm"
          onClick={onRemoveExperienceFilter}
          aria-label="Remove experience filter"
        >
          Experience: {filters.minExperience ?? experienceRange.min} - {filters.maxExperience ?? experienceRange.max} years ×
        </Badge>
      )}
    </div>
  );
}
