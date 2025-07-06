import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SeatSelector from '@/components/SeatSelector';

export default function BookingPage() {
  const router = useRouter();
  const { showtimeId } = router.query;

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch showtime details
  useEffect(() => {
    if (!showtimeId || typeof showtimeId !== 'string') return;

    const id = showtimeId.replace(/^_/, ''); // remove accidental underscore

    fetch(`/api/showtimes/${id}`)
      .then(async res => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Fetch failed: ${res.status} - ${errText}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setShowtime(data.showtime);
        } else {
          throw new Error(data.error || 'Failed to load showtime');
        }
      })
      .catch(err => {
        console.error('Showtime fetch error:', err);
        setMessage('Failed to load showtime. Please try again.');
      });
  }, [showtimeId]);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setMessage('No seats selected!');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      router.push('/login');
      return;
    }

    console.log('Sending selected seats to backend:', selectedSeats);

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user._id,
        movieId: showtime.movie,
        theatreId: showtime.theatre._id,
        showtimeId: showtime._id,
        seats: selectedSeats,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage('Booking successful!');
      setSelectedSeats([]);
    } else {
      setMessage(data.error || 'Booking failed.');
    }
  };

  if (!showtime) {
    return (
      <div className="text-center mt-10 text-lg">
        {message || 'Loading showtime details...'}
      </div>
    );
  }

  const totalPrice = selectedSeats.length * showtime.price;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Booking for {showtime.movieTitle || 'Movie'}
      </h1>
      <p className="mb-2"><strong>Theatre:</strong> {showtime.theatre.name}</p>
      <p className="mb-2"><strong>Screen:</strong> {showtime.screenName}</p>
      <p className="mb-2"><strong>Date:</strong> {showtime.date}</p>
      <p className="mb-2"><strong>Time:</strong> {showtime.time}</p>
      <p className="mb-4"><strong>Price per Seat:</strong> ₹{showtime.price}</p>

      <SeatSelector
        seats={showtime.seats}
        onSeatsChange={setSelectedSeats}
      />

      <p className="mt-4 font-semibold">Total Price: ₹{totalPrice}</p>

      <button
        className={`mt-4 px-4 py-2 rounded text-white ${
          selectedSeats.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
        onClick={handleBooking}
        disabled={selectedSeats.length === 0}
      >
        Confirm Booking
      </button>

      {message && (
        <p className={`mt-4 ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
