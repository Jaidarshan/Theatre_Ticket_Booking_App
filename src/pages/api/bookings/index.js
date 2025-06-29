// /pages/api/bookings/index.js
import dbConnect from '@/lib/mongoose';
import Booking from '@/models/Booking';
import Showtime from '@/models/Showtime';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  await dbConnect();

  const { userId, movieId, theatreId, showtimeId, seats } = req.body;

  try {
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ error: 'Showtime not found' });

    const availableSeats = showtime.seats.filter(seat => !seat.booked);
    if (availableSeats.length < seats.length)
      return res.status(400).json({ error: 'Not enough available seats' });

    // Mark selected seats as booked
    seats.forEach(seatNumber => {
      const seat = showtime.seats.find(s => s.number === seatNumber);
      if (seat) {
        seat.booked = true;
        seat.user = userId;
      }
    });

    await showtime.save();

    const booking = await Booking.create({
      user: userId,
      movie: movieId,
      theatre: theatreId,
      showtime: showtimeId,
      seats,
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
