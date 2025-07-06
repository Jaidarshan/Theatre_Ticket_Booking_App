import dbConnect from '@/lib/mongoose';
import Booking from '@/models/Booking';
import Showtime from '@/models/Showtime';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  await dbConnect();

  const { userId, movieId, theatreId, showtimeId, seats } = req.body;

  if (!userId || !movieId || !theatreId || !showtimeId || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ error: 'Missing required fields or no seats selected' });
  }

  try {
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ error: 'Showtime not found' });

    const seatMap = new Map(showtime.seats.map(seat => [seat.number, seat]));

    // Check if any of the selected seats are already booked
    for (const seatNumber of seats) {
      const seat = seatMap.get(seatNumber);
      if (!seat) return res.status(400).json({ error: `Seat ${seatNumber} does not exist` });
      if (seat.booked) return res.status(400).json({ error: `Seat ${seatNumber} is already booked` });
    }

    // Book the seats
    for (const seatNumber of seats) {
      const seat = seatMap.get(seatNumber);
      seat.booked = true;
      seat.user = userId;
    }

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
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
