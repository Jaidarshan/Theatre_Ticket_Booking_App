import { useEffect, useState } from 'react';

export default function TheatreForm() {
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

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
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
        left: { rows: parseInt(form.balconyLeftRows), cols: parseInt(form.balconyLeftCols) },
        right: { rows: parseInt(form.balconyRightRows), cols: parseInt(form.balconyRightCols) },
      };
    }

    const payload = isNewTheatre
      ? {
          name: form.name,
          location: form.location,
          screen
        }
      : {
          theatreId: form.theatreId,
          screen
        };

    const res = await fetch('/api/theatres/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
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
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <label>
        <input type="radio" checked={isNewTheatre} onChange={() => setIsNewTheatre(true)} />
        Create New Theatre
      </label>
      <label>
        <input type="radio" checked={!isNewTheatre} onChange={() => setIsNewTheatre(false)} />
        Add Screen to Existing Theatre
      </label>

      {!isNewTheatre && (
        <select name="theatreId" value={form.theatreId} onChange={handleChange} required>
          <option value="">Select Theatre</option>
          {theatres.map(t => (
            <option key={t._id} value={t._id}>{t.name} - {t.location}</option>
          ))}
        </select>
      )}

      {isNewTheatre && (
        <>
          <input name="name" placeholder="Theatre Name" value={form.name} onChange={handleChange} required />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        </>
      )}

      <input name="screenName" placeholder="Screen Name (e.g. Screen 1)" value={form.screenName} onChange={handleChange} required />
      <label>Main Seats (Rows x Columns)</label>
      <div style={{ display: 'flex', gap: 10 }}>
        <input type="number" name="seatRows" value={form.seatRows} onChange={handleChange} required min={1} />
        <input type="number" name="seatCols" value={form.seatCols} onChange={handleChange} required min={1} />
      </div>

      <label>
        <input type="checkbox" name="hasBalcony" checked={form.hasBalcony} onChange={handleChange} />
        Has Balcony
      </label>

      {form.hasBalcony && (
        <>
          <label>Balcony Left (Rows x Cols):</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="number" name="balconyLeftRows" value={form.balconyLeftRows} onChange={handleChange} />
            <input type="number" name="balconyLeftCols" value={form.balconyLeftCols} onChange={handleChange} />
          </div>
          <label>Balcony Right (Rows x Cols):</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="number" name="balconyRightRows" value={form.balconyRightRows} onChange={handleChange} />
            <input type="number" name="balconyRightCols" value={form.balconyRightCols} onChange={handleChange} />
          </div>
        </>
      )}

      <button type="submit">{isNewTheatre ? 'Add New Theatre' : 'Add Screen to Theatre'}</button>
      {message && <p>{message}</p>}
    </form>
  );
}
