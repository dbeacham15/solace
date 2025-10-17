import { Advocate, SortField, SortDirection } from '@/types/advocate';

export function sortAdvocates(
  advocates: Advocate[],
  sortField: SortField | null,
  sortDirection: SortDirection
): Advocate[] {
  if (!sortField || !sortDirection) {
    return advocates;
  }

  return [...advocates].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
}
