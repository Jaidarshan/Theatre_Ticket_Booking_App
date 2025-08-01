'use client';
import { useState, useEffect } from 'react';

export default function ShowtimeForm({ onSuccess }) {
  const [form, setForm] = useState({
    movieId: '',
    theatreId: '',
    screenName: '',
    date: '',
    time: '',
    price: '',
  });
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch('/api/movies/list')
      .then(res => res.json())
      .then(data => data.success && setMovies(data.movies));

    fetch('/api/theatres/list')
      .then(res => res.json())
      .then(data => data.success && setTheatres(data.theatres));
  }, []);

  useEffect(() => {
    const selectedTheatre = theatres.find(t => t._id === form.theatreId);
    setScreens(selectedTheatre?.screens || []);
    setForm(prev => ({ ...prev, screenName: '' }));
  }, [form.theatreId, theatres]);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);

    const res = await fetch('/api/showtimes/add-showtime', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.success ? '🎉 Showtime added!' : '❌ ' + data.error);

    if (data.success) {
      setForm({
        movieId: '',
        theatreId: '',
        screenName: '',
        date: '',
        time: '',
        price: '',
      });
      
      // Trigger stats refresh in parent component
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ textAlign: 'center', marginBottom: '25px' }}>
        Add Showtime
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label className="form-label">Movie</label>
          <select
            name="movieId"
            className="form-select"
            value={form.movieId}
            onChange={handleChange}
            required
          >
            <option value="">Select Movie</option>
            {movies.map(m => (
              <option key={m._id} value={m._id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label className="form-label">Theatre</label>
          <select
            name="theatreId"
            className="form-select"
            value={form.theatreId}
            onChange={handleChange}
            required
          >
            <option value="">Select Theatre</option>
            {theatres.map(t => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.location})
              </option>
            ))}
          </select>
        </div>

        {screens.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <label className="form-label">Screen</label>
            <select
              name="screenName"
              className="form-select"
              value={form.screenName}
              onChange={handleChange}
              required
            >
              <option value="">Select Screen</option>
              {screens.map(s => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Time</label>
            <input
              type="time"
              name="time"
              className="form-control"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            placeholder="Enter ticket price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-dark w-100 mt-4"
          style={{ padding: '10px', fontWeight: 'bold' }}
        >
          Add Showtime
        </button>

        {message && (
          <div
            className={`alert mt-3 ${
              message.startsWith('❌') ? 'alert-danger' : 'alert-success'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
