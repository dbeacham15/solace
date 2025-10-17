import { SortField, SortDirection } from '@/types/advocate';

interface SortableHeaderProps {
  field: SortField;
  label: string;
  currentSortField: SortField | null;
  currentSortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function SortableHeader({
  field,
  label,
  currentSortField,
  currentSortDirection,
  onSort,
}: SortableHeaderProps) {
  const isActive = currentSortField === field;

  return (
    <th className="px-6 py-4 text-left text-sm font-semibold text-healthcare-neutral-900">
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-2 hover:text-healthcare-primary-700 transition-colors group"
        aria-label={`Sort by ${label}`}
      >
        {label}
        <span className="flex flex-col text-healthcare-neutral-400 group-hover:text-healthcare-primary-600">
          {isActive ? (
            currentSortDirection === 'asc' ? (
              <svg className="w-4 h-4 text-healthcare-primary-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-healthcare-primary-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 8l5-5 5 5H5zm0 4l5 5 5-5H5z" opacity="0.3" />
            </svg>
          )}
        </span>
      </button>
    </th>
  );
}
