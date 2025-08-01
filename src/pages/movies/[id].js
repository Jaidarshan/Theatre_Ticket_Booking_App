import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

export default function MovieDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`/api/movies/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setMovie(data.movie);
        })
        .catch(err => console.error('Movie fetch error:', err));

      fetch(`/api/showtimes/movie/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setShowtimes(data.showtimes);
          }
        })
        .catch(err => console.error('Showtime fetch error:', err));
    }
  }, [id]);

  const handleBack = () => {
    router.push('/');
  };

  const handleBookNow = (showtimeId) => {
    router.push(`/booking/${showtimeId}`);
  };

  if (!movie) return <div className="text-center mt-5 fs-5">Loading movie details...</div>;

  return (
    <div className="container my-5">
      {/* Back Button */}
      <button className="btn btn-light border mb-4" onClick={handleBack}>
        <FaArrowLeft className="me-2" />
        Back to Movies
      </button>

      {/* Main Content Grid */}
      <div className="row g-4">
        {/* Left - Poster and Info */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="img-fluid rounded mb-3"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
            <span className="badge bg-light text-dark border mb-2">
              {movie.genre?.[0] || 'Genre'}
            </span>
            <p><FaClock className="me-2 text-muted" />{movie.duration} minutes</p>
            <p><strong>Language:</strong> {movie.language}</p>
            <p><strong>Certificate:</strong> {movie.certificate}</p>
            <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Right - Title, Description, and Showtimes */}
        <div className="col-md-8">
          <div className="card p-4 shadow-sm mb-4">
            <h2 className="fw-bold">{movie.title}</h2>
            <p className="text-muted">{movie.description}</p>
          </div>

          <div className="card p-4 shadow-sm">
            <h5 className="fw-semibold mb-3">Available Showtimes</h5>

            {showtimes.length === 0 ? (
              <p className="text-muted">No showtimes available yet.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {showtimes.map(show => (
                  <div
                    key={show._id}
                    className="border rounded p-3 d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="fw-semibold">{show.theatre.name}</div>
                      <div className="text-muted small">
                        <FaMapMarkerAlt className="me-1" />
                        {show.theatre.location}
                      </div>
                      <div className="text-muted small">Screen: {show.screenName}</div>
                      <div className="text-muted small mt-1">
                        <FaClock className="me-1" />
                        {show.date} at {show.time} &nbsp;
                        <span className="text-success">₹{show.price}</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() => handleBookNow(show._id)}
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
