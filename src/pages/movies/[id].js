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
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/movies/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setMovie(data.movie);
        })
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

            const uniqueTheatres = Array.from(
              new Set(data.showtimes.map(s => s.theatre._id))
            ).map(theatreId => data.showtimes.find(s => s.theatre._id === theatreId).theatre);
            setAvailableTheatres(uniqueTheatres);
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
      setSelectedShowtime('');
    } else {
      setAvailableScreens([]);
    }
  }, [selectedTheatre, showtimes]);

  useEffect(() => {
    if (selectedTheatre && selectedScreen) {
      const filteredShowtimes = showtimes.filter(
        s => s.theatre._id === selectedTheatre && s.screenName === selectedScreen
      );
      setAvailableShowtimes(filteredShowtimes);
    } else {
      setAvailableShowtimes([]);
    }
  }, [selectedTheatre, selectedScreen, showtimes]);

  const handleSelectSeat = () => {
    alert('Seat selection feature will be implemented next.');
  };

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>{movie.title}</h1>
      {movie.posterUrl && (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          style={{ width: '300px', height: 'auto' }}
        />
      )}
      <p><strong>Description:</strong> {movie.description}</p>
      <p><strong>Duration:</strong> {movie.duration} mins</p>
      <p><strong>Genre:</strong> {movie.genre?.join(', ')}</p>
      <p><strong>Language:</strong> {movie.language}</p>
      <p><strong>Certificate:</strong> {movie.certificate}</p>
      <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toDateString()}</p>

      <h3>Select Theatre:</h3>
      <select value={selectedTheatre} onChange={e => setSelectedTheatre(e.target.value)}>
        <option value=''>-- Select Theatre --</option>
        {availableTheatres.map(theatre => (
          <option key={theatre._id} value={theatre._id}>{theatre.name}</option>
        ))}
      </select>

      {availableScreens.length > 0 && (
        <>
          <h3>Select Screen:</h3>
          <select value={selectedScreen} onChange={e => setSelectedScreen(e.target.value)}>
            <option value=''>-- Select Screen --</option>
            {availableScreens.map(screen => (
              <option key={screen} value={screen}>{screen}</option>
            ))}
          </select>
        </>
      )}

      {availableShowtimes.length > 0 && (
        <>
          <h3>Select Showtime:</h3>
          <select value={selectedShowtime} onChange={e => setSelectedShowtime(e.target.value)}>
            <option value=''>-- Select Showtime --</option>
            {availableShowtimes.map(show => (
              <option key={show._id} value={show._id}>
                {`${show.date} ${show.time}`} (₹{show.price})
              </option>
            ))}
          </select>
        </>
      )}

      {selectedShowtime && (
        <button onClick={handleSelectSeat} style={{ marginTop: '20px' }}>
          Select Seats
        </button>
      )}

      {message && (
        <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}
