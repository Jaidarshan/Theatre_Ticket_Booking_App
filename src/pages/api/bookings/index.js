import dbConnect from '@/lib/mongoose';
import Booking from '@/models/Booking';
import Showtime from '@/models/Showtime';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  await dbConnect();

  console.log('Booking request body:', req.body);

  const { userId, showtimeId, seats } = req.body;

  if (!userId || !showtimeId || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields or no seats selected',
    });
  }

  try {
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ success: false, error: 'Showtime not found' });

    const seatMap = new Map(showtime.seats.map(s => [s.number, s]));
    for (const num of seats) {
      const seat = seatMap.get(num);
      if (!seat) return res.status(400).json({ success: false, error: `Seat not found: ${num}` });
      if (seat.booked) return res.status(400).json({ success: false, error: `Seat already booked: ${num}` });
    }

    seats.forEach(num => {
      const seat = seatMap.get(num);
      seat.booked = true;
      seat.user = userId;
    });

    await showtime.save();

    const booking = await Booking.create({
      user: userId,
      showtime: showtimeId,
      seats,
      paymentStatus: 'pending',
    });

    return res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
