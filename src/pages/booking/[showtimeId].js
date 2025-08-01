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
    return <div className="text-center mt-5 fs-5">{message || 'Loading showtime...'}</div>;
  }

  const totalPrice = selectedSeats.length * showtime.price;

  return (
    <div className="container my-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => router.back()}>
        &larr; Back
      </button>

      <div className="row">
        {/* Seat Selection */}
        <div className="col-md-8 mb-4">
          <div className="card shadow-sm p-4">
            <h5 className="fw-semibold mb-3">Select Your Seats</h5>
            <div className="text-center text-muted mb-2" style={{ fontSize: '0.9rem' }}>SCREEN</div>
            <hr className="mb-3 mt-0" />

            <div className="fw-semibold mb-2">Main Area</div>

            <SeatSelector
              seats={showtime.seats}
              onSeatsChange={setSelectedSeats}
              selectedSeats={selectedSeats}
            />
          </div>
        </div>

        {/* Booking Summary */}
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold mb-3">Booking Summary</h5>
            <p className="mb-1"><strong>{showtime.movie.title}</strong></p>
            <p className="mb-1 text-muted">{showtime.movie.language}</p>
            <hr />
            <p className="mb-1"><strong>Theatre:</strong> {showtime.theatre.name}</p>
            <p className="mb-1"><strong>Screen:</strong> {showtime.screenName}</p>
            <p className="mb-1"><strong>{showtime.date}</strong></p>
            <p className="mb-3"><strong>{showtime.time}</strong></p>
            <hr />

            <p className="mb-1"><strong>Seats:</strong> ({selectedSeats.length}) {selectedSeats.join(', ')}</p>
            <p className="mb-3"><strong>Total:</strong> ₹{totalPrice}</p>

            <button
              className={`btn btn-dark w-100 mb-2 ${selectedSeats.length === 0 || loading ? 'disabled' : ''}`}
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || loading}
            >
              {loading ? 'Booking...' : `Book Tickets (₹${totalPrice})`}
            </button>

            {bookedSeats.length > 0 && (
              <button
                className="btn btn-outline-primary w-100"
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
          </div>

          {message && (
            <div className={`alert mt-3 ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );

}
