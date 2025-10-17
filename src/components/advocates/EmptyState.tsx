import { Card, CardContent, Button } from '@/components';

interface EmptyStateProps {
  onReset: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-healthcare-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-healthcare-neutral-900">
          No advocates found
        </h3>
        <p className="mt-2 text-healthcare-neutral-600">
          No advocates match your current filters. Try adjusting your filter criteria.
        </p>
        <div className="mt-6">
          <Button onClick={onReset}>Clear All Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
}
