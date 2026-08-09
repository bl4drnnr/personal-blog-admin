import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth-context';
import { LoadingBlock } from '@/components/loader';

/**
 * Client-side gate: redirects to /login when there's no session. This is a UX
 * convenience only — the API enforces auth on every admin endpoint.
 */
export function RequireAuth() {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingBlock label="Restoring session…" />
      </div>
    );
  }
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
