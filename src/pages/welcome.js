import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Welcome() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ backgroundColor: '#f0f4ff' }}
    >
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ fontSize: '2.5rem' }}>
          Movie Booking System
        </h1>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>
          Book your favorite movies with ease
        </p>
      </div>
      <div className="card shadow-sm p-4" style={{ width: '25rem', borderRadius: '10px' }}>
        <h5 className="fw-bold mb-2">For Movie Lovers</h5>
        <p className="text-muted mb-4">
          Browse movies, select showtimes, and book your seats
        </p>
        <div className="d-grid gap-3">
          <Link href="/login" passHref>
            <button className="btn btn-dark btn-lg w-100">Login</button>
          </Link>
          <Link href="/register" passHref>
            <button className="btn btn-outline-dark btn-lg w-100">Register</button>
          </Link>
          <Link href="/movies" passHref>
            <button className="btn btn-outline-dark btn-lg w-100">
              Browse Movies
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
