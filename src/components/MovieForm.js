import { useState } from 'react';
import axios from 'axios';

export default function MovieForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [certificate, setCertificate] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/movies/add', {
        title,
        description,
        posterUrl,
        duration: parseInt(duration),
        genre: genre.split(',').map(g => g.trim()),
        language,
        certificate,
        releaseDate,
      });

      if (res.data.success) {
        setMessage('Movie added!');
        setTitle('');
        setDescription('');
        setPosterUrl('');
        setDuration('');
        setGenre('');
        setLanguage('');
        setCertificate('');
        setReleaseDate('');
      } else {
        setMessage('Error: ' + res.data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to add movie.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <input value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} placeholder="Poster URL" required />
      <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (minutes)" required />
      <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre (comma-separated)" required />
      <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language" required />
      <input value={certificate} onChange={(e) => setCertificate(e.target.value)} placeholder="Certificate (U/A, A)" required />
      <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} placeholder="Release Date" required />

      <button type="submit">Add Movie</button>
      {message && <p>{message}</p>}
    </form>
  );
}
