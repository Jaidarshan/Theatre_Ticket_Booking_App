import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SeatSelector from '@/components/SeatSelector';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function generateTicketPDF({ movieTitle, theatreName, screenName, date, time, language, seats, totalPrice }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 50;
  const lineHeight = 20;

  const lines = [
    `Movie Ticket`,
    `Movie: ${movieTitle}`,
    `Language: ${language}`,
    `Theatre: ${theatreName}`,
    `Screen: ${screenName}`,
    `Date: ${date}`,
    `Time: ${time}`,
    `Seats: ${seats.join(', ')}`,
    `Total Seats: ${seats.length}`,
    `Total Price: Rs. ${totalPrice}`,
  ];

  lines.forEach((text) => {
    page.drawText(text, { x: 50, y, size: 14, font, color: rgb(0, 0, 0) });
    y -= lineHeight;
  });

  const pdfBytes = await pdfDoc.save();

  // Trigger download
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${movieTitle.replace(/\s+/g, '_')}_Ticket.pdf`;
  link.click();
}


export default function BookingPage() {
  const router = useRouter();
  const { showtimeId } = router.query;
  const [bookedSeats, setBookedSeats] = useState([]);
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
      setBookedSeats([...selectedSeats]);
      setSelectedSeats([]);
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
        className={`mt-4 px-4 py-2 rounded text-white ${selectedSeats.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        onClick={handleBooking}
        disabled={selectedSeats.length === 0 || loading}
      >
        {loading ? 'Booking...' : 'Confirm Booking'}
      </button>
      {bookedSeats.length > 0 && (
        <button
          className="ml-4 mt-4 px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
          onClick={() =>
            generateTicketPDF({
              movieTitle: showtime.movie.title,
              theatreName: showtime.theatre.name,
              screenName: showtime.screenName,
              date: showtime.date,
              time: showtime.time,
              language: showtime.movie.language,
              seats: bookedSeats,
              totalPrice: bookedSeats.length * showtime.price,
            })
          }
        >
          Download Ticket
        </button>
      )}

      {message && (
        <p className={`mt-4 ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
