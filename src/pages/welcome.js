import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Welcome() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center p-5 bg-white shadow rounded">
        <h1 className="mb-4">🎬 Welcome to <span className="text-primary">Theatre Booking App</span></h1>
        <p className="mb-4 text-muted">Book your favorite movies at your favorite theatres easily!</p>
        <div className="d-flex justify-content-center gap-3">
          <Link href="/login" passHref>
            <button className="btn btn-outline-primary btn-lg px-4">Login</button>
          </Link>
          <Link href="/register" passHref>
            <button className="btn btn-primary btn-lg px-4">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
