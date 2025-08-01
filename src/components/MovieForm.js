'use client';
import { useState } from 'react';
import axios from 'axios';

export default function MovieForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    posterUrl: '',
    duration: '',
    genre: '',
    language: '',
    certificate: '',
    releaseDate: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        duration: parseInt(form.duration),
        genre: form.genre.split(',').map(g => g.trim()),
      };
      const res = await axios.post('/api/movies/add', payload);
      if (res.data.success) {
        setMessage('🎬 Movie added!');
        setForm({
          title: '',
          description: '',
          posterUrl: '',
          duration: '',
          genre: '',
          language: '',
          certificate: '',
          releaseDate: '',
        });
        
        // Trigger stats refresh in parent component
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setMessage('❌ ' + res.data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to add movie.');
    }
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.05)',
      maxWidth: '800px',
      margin: '0 auto',
      marginTop: '30px',
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New Movie</h2>

      {message && (
        <div
          style={{
            backgroundColor: '#f0f8ff',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '6px',
            color: '#333',
            textAlign: 'center',
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label className="form-label">Movie Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div>
            <label className="form-label">Language</label>
            <input
              name="language"
              value={form.language}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-control"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="form-label">Poster URL</label>
            <input
              name="posterUrl"
              value={form.posterUrl}
              onChange={handleChange}
              type="url"
              className="form-control"
              required
            />
          </div>

          <div>
            <label className="form-label">Duration (minutes)</label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              type="number"
              className="form-control"
              required
            />
          </div>

          <div>
            <label className="form-label">Genres (comma-separated)</label>
            <input
              name="genre"
              value={form.genre}
              onChange={handleChange}
              placeholder="Action, Comedy, Drama"
              className="form-control"
              required
            />
          </div>

          <div>
            <label className="form-label">Certificate</label>
            <input
              name="certificate"
              value={form.certificate}
              onChange={handleChange}
              placeholder="U/A, A"
              className="form-control"
              required
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Release Date</label>
            <input
              name="releaseDate"
              value={form.releaseDate}
              onChange={handleChange}
              type="date"
              className="form-control"
              required
            />
          </div>
        </div>

        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <button type="submit" className="btn btn-dark me-2">Add Movie</button>
          <button type="reset" className="btn btn-outline-secondary" onClick={() => setForm({
            title: '',
            description: '',
            posterUrl: '',
            duration: '',
            genre: '',
            language: '',
            certificate: '',
            releaseDate: '',
          })}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
