import { useState, useEffect } from 'react';

export default function ShowtimeForm() {
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
      .then(data => {
        if (data.success) setMovies(data.movies);
      });

    fetch('/api/theatres/list')
      .then(res => res.json())
      .then(data => {
        if (data.success) setTheatres(data.theatres);
      });
  }, []);

  // Fetch screens when theatre changes
  useEffect(() => {
    const selected = theatres.find(t => t._id === form.theatreId);
    if (selected?.screens) {
      setScreens(selected.screens);
    } else {
      setScreens([]);
    }
    setForm(prev => ({ ...prev, screenName: '' }));
  }, [form.theatreId, theatres]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);

    const res = await fetch('/api/showtimes/add-showtime', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      setMessage('Showtime added successfully');
      setForm({ movieId: '', theatreId: '', screenName: '', date: '', time: '', price: '' });
    } else {
      setMessage('Error: ' + data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <select name="movieId" value={form.movieId} onChange={handleChange} required>
        <option value="">Select Movie</option>
        {movies.map(m => (
          <option key={m._id} value={m._id}>{m.title}</option>
        ))}
      </select>

      <select name="theatreId" value={form.theatreId} onChange={handleChange} required>
        <option value="">Select Theatre</option>
        {theatres.map(t => (
          <option key={t._id} value={t._id}>{t.name} ({t.location})</option>
        ))}
      </select>

      {screens.length > 0 && (
        <select name="screenName" value={form.screenName} onChange={handleChange} required>
          <option value="">Select Screen</option>
          {screens.map(screen => (
            <option key={screen.name} value={screen.name}>{screen.name}</option>
          ))}
        </select>
      )}

      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <input type="time" name="time" value={form.time} onChange={handleChange} required />
      <input type="number" name="price" placeholder="Ticket Price" value={form.price} onChange={handleChange} required />

      <button type="submit">Add Showtime</button>
      {message && <p>{message}</p>}
    </form>
  );
}
