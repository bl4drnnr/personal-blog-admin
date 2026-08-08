/** Temporary stand-in for screens delivered in M2/M3. */
export function Placeholder({ title }: { title: string }) {
  return (
    <div className="page">
      <h1 className="page-h1">{title}</h1>
      <p className="muted">Coming in the next milestone.</p>
    </div>
  );
}
