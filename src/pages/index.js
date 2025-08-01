import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MovieCard from '@/components/MovieCard';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      router.replace('/welcome');
    }
  }, [router]);

  useEffect(() => {
    fetch('/api/movies/list')
      .then(r => r.json())
      .then(d => {
        if (d.success) setMovies(d.movies);
      })
      .catch(console.error);
  }, []);

  if (!user) return <div className="text-center mt-5"><p>Loading…</p></div>;

  return (
    <div className="container py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Welcome, {user.name}</h2>
        <button
          className="btn btn-outline-danger px-4"
          onClick={() => {
            localStorage.removeItem('user');
            router.push('/welcome');
          }}
        >
          Logout
        </button>
      </div>

      {/* Movies Section Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Now Showing</h3>
      </div>

      {/* Movies Section */}
      {movies.length === 0 ? (
        <div className="text-center mt-5">
          <p className="text-muted fs-5">No movies available.</p>
        </div>
      ) : (
        <div className="row g-4">
          {movies.map((m) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={m._id}>
              <MovieCard movie={m} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
