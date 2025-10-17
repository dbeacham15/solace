interface ResultsCountProps {
  filteredCount: number;
  totalCount: number;
}

export function ResultsCount({ filteredCount, totalCount }: ResultsCountProps) {
  return (
    <p className="text-healthcare-neutral-700 font-medium mb-3" role="status" aria-live="polite">
      {filteredCount === totalCount ? (
        <>Showing all {totalCount} advocates</>
      ) : (
        <>Showing {filteredCount} of {totalCount} advocates with active filters</>
      )}
    </p>
  );
}
