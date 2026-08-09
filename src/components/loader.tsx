/**
 * Loading affordances for the admin.
 *
 * `Spinner` is the inline mark; `LoadingBlock` is what a page shows while its
 * first query resolves. Both are labelled for screen readers, since an
 * unlabelled spinner announces nothing at all.
 */

export function Spinner({ label }: { label?: string }) {
  return (
    <span className="spinner" role="status" aria-label={label ?? 'Loading'}>
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.2"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="loading-block">
      <Spinner label={label} />
      <span>{label}</span>
    </div>
  );
}
