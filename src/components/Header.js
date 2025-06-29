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
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link href="/"><a><h1>Theatre Booking</h1></a></Link>
      <nav>
        {user ? (
          <>
            <span>Welcome, {user.name}</span> |{' '}
            {user.isAdmin && <Link href="/admin/dashboard"><a>Admin Dashboard</a></Link>} |{' '}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link> |{' '}
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
