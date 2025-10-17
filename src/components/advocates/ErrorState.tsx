import { Card, CardContent, Button } from '@/components';

interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-healthcare-error-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-healthcare-neutral-900">
          Failed to load advocates
        </h3>
        <p className="mt-2 text-healthcare-neutral-600 mb-6">
          {error?.message || 'An unexpected error occurred while fetching the data.'}
        </p>
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
