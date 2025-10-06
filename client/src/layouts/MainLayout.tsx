import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './MainLayout.css';

export default function MainLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  return (
    <div className="layout-root">
      <header className="layout-header">
        <nav className="layout-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/habits">Habits</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/settings">Settings</Link>
        </nav>
        <div className="layout-auth">
          {isAuthenticated ? (
            <>
              <span className="layout-user">{user?.name ?? user?.email}</span>
              <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => loginWithRedirect()}>Login</button>
          )}
        </div>
      </header>
      <main className="layout-content">{children}</main>
    </div>
  );
}
