'use client';
import { useEffect, useState } from 'react';

export default function TheatreForm({ onSuccess }) {
  const [theatres, setTheatres] = useState([]);
  const [isNewTheatre, setIsNewTheatre] = useState(true);
  const [form, setForm] = useState({
    theatreId: '',
    name: '',
    location: '',
    screenName: 'Screen 1',
    seatRows: 5,
    seatCols: 6,
    hasBalcony: false,
    balconyLeftRows: 2,
    balconyLeftCols: 4,
    balconyRightRows: 2,
    balconyRightCols: 4,
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch('/api/theatres/list')
      .then(res => res.json())
      .then(data => {
        if (data.success) setTheatres(data.theatres);
      });
  }, []);

  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);

    const screen = {
      name: form.screenName,
      seatLayout: {
        rows: parseInt(form.seatRows),
        cols: parseInt(form.seatCols),
      },
      hasBalcony: form.hasBalcony,
    };

    if (form.hasBalcony) {
      screen.balconyLayout = {
        left: {
          rows: parseInt(form.balconyLeftRows),
          cols: parseInt(form.balconyLeftCols),
        },
        right: {
          rows: parseInt(form.balconyRightRows),
          cols: parseInt(form.balconyRightCols),
        },
      };
    }

    const payload = isNewTheatre
      ? { name: form.name, location: form.location, screen }
      : { theatreId: form.theatreId, screen };

    const res = await fetch('/api/theatres/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setMessage(data.success ? '✅ ' + data.message : '❌ Error: ' + data.error);

    if (data.success) {
      setForm({
        theatreId: '',
        name: '',
        location: '',
        screenName: 'Screen 1',
        seatRows: 5,
        seatCols: 6,
        hasBalcony: false,
        balconyLeftRows: 2,
        balconyLeftCols: 4,
        balconyRightRows: 2,
        balconyRightCols: 4,
      });
      setIsNewTheatre(true);
      
      // Trigger stats refresh in parent component
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '30px',
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ marginBottom: '10px' }}>Add Theatre or Screen</h3>
      <p style={{ color: '#888', marginBottom: '25px' }}>
        Create a new theatre or add a screen to an existing theatre.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Toggle Options */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 500, marginBottom: '10px', display: 'block' }}>
            Select Option:
          </label>
          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                checked={isNewTheatre}
                onChange={() => setIsNewTheatre(true)}
              />
              Create New Theatre
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                checked={!isNewTheatre}
                onChange={() => setIsNewTheatre(false)}
              />
              Add Screen to Existing Theatre
            </label>
          </div>
        </div>

        {!isNewTheatre && (
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Select Theatre</label>
            <select
              name="theatreId"
              className="form-select"
              value={form.theatreId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Theatre --</option>
              {theatres.map(t => (
                <option key={t._id} value={t._id}>
                  {t.name} — {t.location}
                </option>
              ))}
            </select>
          </div>
        )}

        {isNewTheatre && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Theatre Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label className="form-label">Screen Name</label>
          <input
            type="text"
            name="screenName"
            className="form-control"
            value={form.screenName}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label className="form-label">Main Area (Rows × Columns)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number"
              name="seatRows"
              className="form-control"
              value={form.seatRows}
              onChange={handleChange}
              min={1}
              required
            />
            <span style={{ lineHeight: '38px' }}>×</span>
            <input
              type="number"
              name="seatCols"
              className="form-control"
              value={form.seatCols}
              onChange={handleChange}
              min={1}
              required
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              name="hasBalcony"
              checked={form.hasBalcony}
              onChange={handleChange}
            />
            Has Balcony
          </label>
        </div>

        {form.hasBalcony && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Balcony Left (Rows × Columns)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  name="balconyLeftRows"
                  className="form-control"
                  value={form.balconyLeftRows}
                  onChange={handleChange}
                />
                <span style={{ lineHeight: '38px' }}>×</span>
                <input
                  type="number"
                  name="balconyLeftCols"
                  className="form-control"
                  value={form.balconyLeftCols}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Balcony Right (Rows × Columns)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  name="balconyRightRows"
                  className="form-control"
                  value={form.balconyRightRows}
                  onChange={handleChange}
                />
                <span style={{ lineHeight: '38px' }}>×</span>
                <input
                  type="number"
                  name="balconyRightCols"
                  className="form-control"
                  value={form.balconyRightCols}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="submit"
            className="btn btn-dark"
            style={{ padding: '10px 20px', fontWeight: 'bold' }}
          >
            {isNewTheatre ? 'Create Theatre' : 'Add Screen'}
          </button>
          {message && (
            <span style={{ color: '#555', fontSize: '0.9rem' }}>{message}</span>
          )}
        </div>
      </form>
    </div>
  );
}
