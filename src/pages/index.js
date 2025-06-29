// src/pages/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MovieCard from '@/components/MovieCard';

export default function Home() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const router = useRouter();

  // redirect to welcome if not logged in
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      router.replace('/welcome');
    }
  }, [router]);

  // fetch movies once
  useEffect(() => {
    fetch('/api/movies/list')
      .then(r => r.json())
      .then(d => {
        if (d.success) setMovies(d.movies);
      })
      .catch(console.error);
  }, []);

  if (!user) return <p>Loading…</p>;

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display:'flex', justifyContent:'space-between' }}>
        <h2>Welcome, {user.name}</h2>
        <button onClick={() => { localStorage.removeItem('user'); router.push('/welcome'); }}>
          Logout
        </button>
      </header>

      <h3>Now Showing</h3>
      {movies.length === 0 ? (
        <p>No movies available.</p>
      ) : (
        <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem' }}>
          {movies.map(m => <MovieCard key={m._id} movie={m} />)}
        </div>
      )}
    </div>
  );
}
