import { useEffect, useState } from 'react';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch('/api/movies/list');
      const data = await res.json();
      if (data.success) {
        setMovies(data.movies);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Available Movies</h2>
      {movies.length === 0 ? (
        <p>No movies available</p>
      ) : (
        <ul>
          {movies.map((movie) => (
            <li key={movie._id}>
              <h3>{movie.title}</h3>
              <p>{movie.description}</p>
              <p><strong>Theatres:</strong> {movie.theatres.map(t => t.name).join(', ')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
