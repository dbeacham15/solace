import React from 'react';

interface ExperienceRangeProps {
  label: string;
  min: number | null;
  max: number | null;
  availableMin: number;
  availableMax: number;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
}

export const ExperienceRange: React.FC<ExperienceRangeProps> = ({
  label,
  min,
  max,
  availableMin,
  availableMax,
  onMinChange,
  onMaxChange,
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : parseInt(e.target.value);
    onMinChange(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : parseInt(e.target.value);
    onMaxChange(value);
  };

  const isValid = () => {
    if (min === null && max === null) return true;
    if (min === null || max === null) return true;
    return min <= max;
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-healthcare-neutral-700 mb-2">
        {label}
      </label>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="number"
            placeholder={`Min (${availableMin})`}
            value={min === null ? '' : min}
            onChange={handleMinChange}
            min={availableMin}
            max={availableMax}
            className={`w-full px-4 py-2.5 border-2 rounded-healthcare focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200 ${
              !isValid()
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-healthcare-neutral-200 focus:border-healthcare-primary-500 focus:ring-healthcare-primary-500'
            }`}
            aria-label="Minimum years of experience"
          />
        </div>

        <span className="text-healthcare-neutral-500 font-medium">to</span>

        <div className="flex-1">
          <input
            type="number"
            placeholder={`Max (${availableMax})`}
            value={max === null ? '' : max}
            onChange={handleMaxChange}
            min={availableMin}
            max={availableMax}
            className={`w-full px-4 py-2.5 border-2 rounded-healthcare focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200 ${
              !isValid()
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-healthcare-neutral-200 focus:border-healthcare-primary-500 focus:ring-healthcare-primary-500'
            }`}
            aria-label="Maximum years of experience"
          />
        </div>
      </div>

      {!isValid() && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          Minimum must be less than or equal to maximum
        </p>
      )}

      <p className="mt-2 text-sm text-healthcare-neutral-500">
        Available range: {availableMin} - {availableMax} years
      </p>
    </div>
  );
};
