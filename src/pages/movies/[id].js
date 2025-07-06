import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function MovieDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [availableTheatres, setAvailableTheatres] = useState([]);
  const [availableScreens, setAvailableScreens] = useState([]);
  const [availableShowtimes, setAvailableShowtimes] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState('');
  const [selectedScreen, setSelectedScreen] = useState('');
  const [selectedShowtimeId, setSelectedShowtimeId] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/movies/${id}`)
        .then(res => res.json())
        .then(data => { if (data.success) setMovie(data.movie); })
        .catch(err => console.error('Movie fetch error:', err));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetch(`/api/showtimes/movie/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setShowtimes(data.showtimes);
            const theatres = Array.from(
              new Set(data.showtimes.map(s => s.theatre._id))
            ).map(tid => data.showtimes.find(s => s.theatre._id === tid).theatre);
            setAvailableTheatres(theatres);
          }
        })
        .catch(err => console.error('Showtime fetch error:', err));
    }
  }, [id]);

  useEffect(() => {
    if (selectedTheatre) {
      const screens = Array.from(
        new Set(
          showtimes
            .filter(s => s.theatre._id === selectedTheatre)
            .map(s => s.screenName)
        )
      );
      setAvailableScreens(screens);
      setSelectedScreen('');
      setSelectedShowtimeId('');
    } else {
      setAvailableScreens([]);
    }
  }, [selectedTheatre, showtimes]);

  useEffect(() => {
    if (selectedTheatre && selectedScreen) {
      const sts = showtimes.filter(
        s =>
          s.theatre._id === selectedTheatre &&
          s.screenName === selectedScreen
      );
      setAvailableShowtimes(sts);
      setSelectedShowtimeId('');
    } else {
      setAvailableShowtimes([]);
    }
  }, [selectedTheatre, selectedScreen, showtimes]);

  const handleSelectSeat = () => {
    if (!selectedShowtimeId) return;
    router.push(`/booking/${selectedShowtimeId}`);
  };

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{movie.title}</h1>
      {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="w-64 mb-4" />}
      <p className="mb-2"><strong>Description:</strong> {movie.description}</p>
      <p className="mb-2"><strong>Duration:</strong> {movie.duration} mins</p>
      <p className="mb-2"><strong>Genre:</strong> {movie.genre?.join(', ')}</p>
      <p className="mb-2"><strong>Language:</strong> {movie.language}</p>
      <p className="mb-2"><strong>Certificate:</strong> {movie.certificate}</p>
      <p className="mb-4"><strong>Release Date:</strong> {new Date(movie.releaseDate).toDateString()}</p>

      <div className="mb-4">
        <h3 className="font-semibold">Select Theatre:</h3>
        <select
          className="border p-2 w-full"
          value={selectedTheatre}
          onChange={e => setSelectedTheatre(e.target.value)}
        >
          <option value="">-- Select Theatre --</option>
          {availableTheatres.map(theatre => (
            <option key={theatre._id} value={theatre._id}>{theatre.name}</option>
          ))}
        </select>
      </div>

      {availableScreens.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold">Select Screen:</h3>
          <select
            className="border p-2 w-full"
            value={selectedScreen}
            onChange={e => setSelectedScreen(e.target.value)}
          >
            <option value="">-- Select Screen --</option>
            {availableScreens.map(screen => (
              <option key={screen} value={screen}>{screen}</option>
            ))}
          </select>
        </div>
      )}

      {availableShowtimes.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold">Select Showtime:</h3>
          <select
            className="border p-2 w-full"
            value={selectedShowtimeId}
            onChange={e => setSelectedShowtimeId(e.target.value)}
          >
            <option value="">-- Select Showtime --</option>
            {availableShowtimes.map(show => (
              <option key={show._id} value={show._id}>
                {`${show.date} ${show.time}`} (₹{show.price})
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedShowtimeId && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSelectSeat}
        >
          Select Seats
        </button>
      )}
    </div>
  );
}
