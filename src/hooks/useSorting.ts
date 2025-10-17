import { useState } from 'react';
import { SortField, SortDirection, SortState } from '@/types/advocate';

export function useSorting() {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const sortState: SortState = {
    sortField,
    sortDirection,
  };

  const handleSort = (field: SortField) => {
    let direction: SortDirection = 'asc';

    if (sortField === field) {
      if (sortDirection === 'asc') {
        direction = 'desc';
      } else if (sortDirection === 'desc') {
        direction = null;
        setSortField(null);
        setSortDirection(null);
        return;
      }
    }

    setSortField(field);
    setSortDirection(direction);
  };

  const resetSort = () => {
    setSortField(null);
    setSortDirection(null);
  };

  return {
    sortState,
    sortField,
    sortDirection,
    handleSort,
    resetSort,
  };
}
