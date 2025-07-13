import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SeatSelector from '@/components/SeatSelector';

export default function BookingPage() {
  const router = useRouter();
  const { showtimeId } = router.query;

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchShowtime = async (id) => {
    try {
      const res = await fetch(`/api/showtimes/${id}`);
      const data = await res.json();
      if (data.success) {
        setShowtime(data.showtime);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setMessage('Failed to load showtime.');
    }
  };

  useEffect(() => {
    if (!showtimeId) return;
    const id = showtimeId.startsWith('_') ? showtimeId.slice(1) : showtimeId;
    fetchShowtime(id);
  }, [showtimeId]);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setMessage('No seats selected!');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
      router.push('/login');
      return;
    }

    const payload = {
      userId: user._id,
      showtimeId: showtime._id,
      seats: selectedSeats,
    };

    setLoading(true);
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok && data.success) {
      setMessage('Booking successful!');
      setSelectedSeats([]); // Reset seats

      // Re-fetch latest showtime to update booked seats from DB
      await fetchShowtime(showtime._id);
    } else {
      setMessage(data.error || 'Booking failed.');
    }
  };

  if (!showtime) {
    return <div className="text-center mt-10 text-lg">{message || 'Loading showtime...'}</div>;
  }

  const totalPrice = selectedSeats.length * showtime.price;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Booking for {showtime.movie.title}
      </h1>
      <p><strong>Theatre:</strong> {showtime.theatre.name}</p>
      <p><strong>Screen:</strong> {showtime.screenName}</p>
      <p><strong>Date:</strong> {showtime.date}</p>
      <p><strong>Time:</strong> {showtime.time}</p>
      <p className="mb-4"><strong>Price per Seat:</strong> ₹{showtime.price}</p>

      <SeatSelector
        seats={showtime.seats}
        onSeatsChange={setSelectedSeats}
        selectedSeats={selectedSeats}
      />

      <p className="mt-4 font-semibold">Total Price: ₹{totalPrice}</p>

      <button
        className={`mt-4 px-4 py-2 rounded text-white ${
          selectedSeats.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
        onClick={handleBooking}
        disabled={selectedSeats.length === 0 || loading}
      >
        {loading ? 'Booking...' : 'Confirm Booking'}
      </button>

      {message && (
        <p className={`mt-4 ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
