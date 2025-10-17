import { Card, CardContent, Input, Button, MultiSelect, ExperienceRange } from '@/components';
import { ExperienceRange as ExperienceRangeType } from '@/types/advocate';

interface FilterSectionProps {
  nameSearch: string;
  onNameSearchChange: (value: string) => void;
  selectedCities: string[];
  onSelectedCitiesChange: (value: string[]) => void;
  selectedDegrees: string[];
  onSelectedDegreesChange: (value: string[]) => void;
  selectedSpecialties: string[];
  onSelectedSpecialtiesChange: (value: string[]) => void;
  minExperience: number | null;
  onMinExperienceChange: (value: number | null) => void;
  maxExperience: number | null;
  onMaxExperienceChange: (value: number | null) => void;
  uniqueCities: string[];
  uniqueDegrees: string[];
  uniqueSpecialties: string[];
  experienceRange: ExperienceRangeType;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function FilterSection({
  nameSearch,
  onNameSearchChange,
  selectedCities,
  onSelectedCitiesChange,
  selectedDegrees,
  onSelectedDegreesChange,
  selectedSpecialties,
  onSelectedSpecialtiesChange,
  minExperience,
  onMinExperienceChange,
  maxExperience,
  onMaxExperienceChange,
  uniqueCities,
  uniqueDegrees,
  uniqueSpecialties,
  experienceRange,
  onReset,
  hasActiveFilters,
}: FilterSectionProps) {
  return (
    <Card className="mb-8">
      <CardContent>
        <div className="mb-6">
          <Input
            label="Search by Name"
            placeholder="Enter first or last name..."
            value={nameSearch}
            onChange={(e) => onNameSearchChange(e.target.value)}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            aria-label="Search advocates by name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          <MultiSelect
            label="Specialties"
            options={uniqueSpecialties}
            selected={selectedSpecialties}
            onChange={onSelectedSpecialtiesChange}
            placeholder="Select specialties..."
            searchable={true}
          />

          <MultiSelect
            label="Locations"
            options={uniqueCities}
            selected={selectedCities}
            onChange={onSelectedCitiesChange}
            placeholder="Select locations..."
          />

          <MultiSelect
            label="Credentials"
            options={uniqueDegrees}
            selected={selectedDegrees}
            onChange={onSelectedDegreesChange}
            placeholder="Select degrees..."
          />

          <ExperienceRange
            label="Years of Experience"
            min={minExperience}
            max={maxExperience}
            availableMin={experienceRange.min}
            availableMax={experienceRange.max}
            onMinChange={onMinExperienceChange}
            onMaxChange={onMaxExperienceChange}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={!hasActiveFilters}
            aria-label="Clear all filters"
          >
            Clear All Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
