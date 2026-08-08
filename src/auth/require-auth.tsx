import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth-context';

/**
 * Client-side gate: redirects to /login when there's no session. This is a UX
 * convenience only — the API enforces auth on every admin endpoint.
 */
export function RequireAuth() {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <div className="page-loading">Loading…</div>;
  }
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
