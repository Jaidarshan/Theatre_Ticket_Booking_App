import dbConnect from '@/lib/mongoose';
import Showtime from '@/models/Showtime';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  await dbConnect();

  const { movie, theatre, date, time, price, seats } = req.body;

  try {
    const showtime = await Showtime.create({
      movie,
      theatre,
      date,
      time,
      price,
      seats: seats.map((number) => ({ number })),
    });

    res.status(201).json({ success: true, showtime });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
