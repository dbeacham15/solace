export function LoadingState() {
  return (
    <div className="text-center py-12" role="status" aria-live="polite">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-healthcare-primary-200 border-t-healthcare-primary-600"></div>
      <p className="mt-4 text-healthcare-neutral-600">Loading advocates...</p>
    </div>
  );
}
