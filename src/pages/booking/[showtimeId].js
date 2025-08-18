import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SeatSelector from '@/components/SeatSelector';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function generateTicketPDF({ movieTitle, theatreName, screenName, date, time, language, seats, totalPrice, posterUrl }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]); // Wider ticket format
  const { width, height } = page.getSize();
  
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Background color (light blue)
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: height,
    color: rgb(0.95, 0.97, 1),
  });

  // Header background
  page.drawRectangle({
    x: 0,
    y: height - 80,
    width: width,
    height: 80,
    color: rgb(0.2, 0.3, 0.6),
  });

  // Movie poster (if available) - moved to right side
  let posterImage = null;
  let imageX = width - 110; // Position on right side
  let imageWidth = 80;
  let imageHeight = 120;

  if (posterUrl) {
    try {
      console.log('Attempting to fetch poster from:', posterUrl); // Debug log
      const imageResponse = await fetch(posterUrl);
      if (imageResponse.ok) {
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        
        // Try to embed as JPG first, then PNG
        try {
          posterImage = await pdfDoc.embedJpg(imageArrayBuffer);
          console.log('Successfully embedded JPG poster'); // Debug log
        } catch {
          try {
            posterImage = await pdfDoc.embedPng(imageArrayBuffer);
            console.log('Successfully embedded PNG poster'); // Debug log
          } catch (e) {
            console.log('Could not embed poster image:', e);
          }
        }
      } else {
        console.log('Failed to fetch poster, status:', imageResponse.status);
      }
    } catch (e) {
      console.log('Error fetching poster:', e);
    }
  } else {
    console.log('No poster URL provided');
  }

  if (posterImage) {
    // Draw the movie poster on the right side
    page.drawImage(posterImage, {
      x: imageX,
      y: height - 200,
      width: imageWidth,
      height: imageHeight,
    });
  }

  // Title
  page.drawText('MOVIE TICKET', {
    x: 30,
    y: height - 35,
    size: 24,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  // Ticket number (random)
  const ticketNumber = `TKT${Date.now().toString().slice(-8)}`;
  page.drawText(`Ticket #${ticketNumber}`, {
    x: width - 180,
    y: height - 35,
    size: 14,
    font: helvetica,
    color: rgb(1, 1, 1),
  });

  // Content area starts from left side (poster is now on right)
  const contentX = 30;
  let y = height - 110;
  const lineHeight = 25;

  // Movie details
  page.drawText(movieTitle, {
    x: contentX,
    y: y,
    size: 20,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  page.drawText(`Language: ${language}`, {
    x: contentX,
    y: y,
    size: 12,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  // Theatre and screen info
  page.drawText(`${theatreName}`, {
    x: contentX,
    y: y,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  page.drawText(`Screen: ${screenName}`, {
    x: contentX,
    y: y,
    size: 12,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 25;

  // Date and time box
  page.drawRectangle({
    x: contentX,
    y: y - 15,
    width: 200,
    height: 30,
    color: rgb(0.9, 0.95, 1),
    borderColor: rgb(0.2, 0.3, 0.6),
    borderWidth: 1,
  });

  page.drawText(`${date} • ${time}`, {
    x: contentX + 10,
    y: y - 5,
    size: 12,
    font: helveticaBold,
    color: rgb(0.2, 0.3, 0.6),
  });
  y -= 45;

  // Seats section
  page.drawText('SEATS:', {
    x: contentX,
    y: y,
    size: 12,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });

  page.drawText(seats.join(', '), {
    x: contentX + 60,
    y: y,
    size: 12,
    font: helvetica,
    color: rgb(0.2, 0.3, 0.6),
  });
  y -= 20;

  // Total price section - moved to left side
  page.drawRectangle({
    x: contentX,
    y: y - 15,
    width: 120,
    height: 30,
    color: rgb(0.2, 0.7, 0.3),
  });

  page.drawText('TOTAL', {
    x: contentX + 10,
    y: y - 10,
    size: 10,
    font: helvetica,
    color: rgb(1, 1, 1),
  });

  page.drawText(`Rs. ${totalPrice}`, {
    x: contentX + 10,
    y: y + 2,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  // Footer
  page.drawText('Thank you for choosing our cinema! Show this ticket at the entrance.', {
    x: 30,
    y: 30,
    size: 10,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Decorative border
  page.drawRectangle({
    x: 10,
    y: 10,
    width: width - 20,
    height: height - 20,
    borderColor: rgb(0.2, 0.3, 0.6),
    borderWidth: 2,
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
                    posterUrl: showtime.movie.posterUrl,
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
