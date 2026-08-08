import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/auth-context';

const NAV = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/posts', label: 'Posts' },
  { to: '/assets', label: 'Assets' },
  { to: '/about', label: 'About / CV' },
  { to: '/settings', label: 'Site settings' },
  { to: '/security', label: 'Security' },
];

export function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">BLOG ADMIN</div>
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="btn ghost logout" onClick={onLogout}>
          Sign out
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
