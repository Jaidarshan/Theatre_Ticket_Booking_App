import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import TheatreForm from '../../components/TheatreForm';
import MovieForm from '../../components/MovieForm';
import ShowtimeForm from '../../components/ShowtimeForm';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [stats, setStats] = useState({
    theatres: 0,
    movies: 0,
    showtimes: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('user'));
      if (!stored || !stored.isAdmin) window.location.href = '/login';
      else {
        setUser(stored);
        fetchStats();
      }
    }
  }, []);

  // Refresh stats when forms are closed (after potential data changes)
  useEffect(() => {
    if (activeForm === null && user) {
      fetchStats();
    }
  }, [activeForm, user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/welcome');
  };

  if (!user) return <div className="d-flex justify-content-center align-items-center vh-100"><span>Redirecting...</span></div>;

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Admin Dashboard</h2>
          <p className="mb-0">Welcome back, {user.name || 'Admin'} 👋</p>
        </div>
        <div>
          <button className="btn btn-outline-info me-2" onClick={fetchStats} disabled={loading}>
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Refreshing...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh Stats
              </>
            )}
          </button>
          <button className="btn btn-outline-secondary me-2" onClick={() => router.push('/movies')}>View Movies</button>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row text-center mb-5">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h5 className="fw-semibold">Theatres</h5>
            <h3 className="text-primary">
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                stats.theatres
              )}
            </h3>
            <p className="text-muted">Active theatres</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h5 className="fw-semibold">Movies</h5>
            <h3 className="text-success">
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                stats.movies
              )}
            </h3>
            <p className="text-muted">Currently showing</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h5 className="fw-semibold">Showtimes</h5>
            <h3 className="text-info">
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                stats.showtimes
              )}
            </h3>
            <p className="text-muted">This week</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h5 className="fw-semibold">Users</h5>
            <h3 className="text-warning">
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                stats.users
              )}
            </h3>
            <p className="text-muted">Registered users</p>
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm p-4">
            <h5 className="fw-semibold mb-2">Theatre Management</h5>
            <p className="text-muted mb-3">Add new theatres and manage screens</p>
            <button className="btn btn-dark w-100" onClick={() => setActiveForm('theatre')}>Manage Theatres</button>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm p-4">
            <h5 className="fw-semibold mb-2">Movie Management</h5>
            <p className="text-muted mb-3">Add movies and manage movie details</p>
            <button className="btn btn-dark w-100" onClick={() => setActiveForm('movie')}>Manage Movies</button>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm p-4">
            <h5 className="fw-semibold mb-2">Showtime Management</h5>
            <p className="text-muted mb-3">Schedule showtimes and manage bookings</p>
            <button className="btn btn-dark w-100" onClick={() => setActiveForm('showtime')}>Manage Showtimes</button>
          </div>
        </div>
      </div>

      {/* Forms Section */}
      {activeForm && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-semibold">
                {activeForm === 'theatre' && 'Theatre Management'}
                {activeForm === 'movie' && 'Movie Management'}
                {activeForm === 'showtime' && 'Showtime Management'}
              </h4>
              <button className="btn btn-outline-secondary" onClick={() => setActiveForm(null)}>
                Close Form
              </button>
            </div>
            <div className="card shadow-sm">
              <div className="card-body">
                {activeForm === 'theatre' && <TheatreForm onSuccess={fetchStats} />}
                {activeForm === 'movie' && <MovieForm onSuccess={fetchStats} />}
                {activeForm === 'showtime' && <ShowtimeForm onSuccess={fetchStats} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
