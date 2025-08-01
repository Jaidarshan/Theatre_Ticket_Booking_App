import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  function logout() {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  }

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm px-4 py-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand">
          <h4 className="mb-0">🎬 Theatre Booking</h4>
        </Link>

        <nav className="d-flex align-items-center gap-3">
          {user ? (
            <>
              <span className="text-muted">Welcome, <strong>{user.name}</strong></span>
              {user.isAdmin && (
                <Link href="/admin/dashboard" className="btn btn-outline-primary btn-sm">
                  Admin Dashboard
                </Link>
              )}
              <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline-secondary btn-sm">Login</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
