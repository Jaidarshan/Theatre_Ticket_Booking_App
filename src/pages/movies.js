import { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <div
      className="d-flex flex-column justify-content-start align-items-center min-vh-100 py-5"
      style={{ backgroundColor: '#f0f4ff' }}
    >
      <div className="container">
        {/* Header with Back Button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Available Movies</h2>
          <Link href="/" passHref>
            <button className="btn btn-outline-dark px-4">← Back to Home</button>
          </Link>
        </div>

        {/* Movies Section */}
        {movies.length === 0 ? (
          <div className="text-center mt-5">
            <p className="text-muted fs-5">No movies available</p>
          </div>
        ) : (
          <div className="row justify-content-center">
            {movies.map((movie) => (
              <div className="col-md-6 col-lg-4 mb-4" key={movie._id}>
                <div className="card shadow-sm h-100 border-0" style={{ borderRadius: '12px' }}>
                  {/* Movie Poster (if available) */}
                  {movie.poster && (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="card-img-top"
                      style={{
                        height: '300px',
                        objectFit: 'cover',
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px',
                      }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{movie.title}</h5>
                    <p className="card-text text-muted flex-grow-1">{movie.description}</p>
                    <p className="mb-2">
                      <strong>Theatres:</strong>{' '}
                      {movie.theatres.length > 0
                        ? movie.theatres.map((t) => t.name).join(', ')
                        : 'N/A'}
                    </p>
                    <a
                      href={`/movies/${movie._id}`}
                      className="btn btn-dark btn-sm w-100 mt-auto"
                    >
                      View Details & Book
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
