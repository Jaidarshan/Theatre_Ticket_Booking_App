import dbConnect from '@/lib/mongoose';
import Showtime from '@/models/Showtime';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  await dbConnect();

  const movieId = req.query.id;

  try {
    const showtimes = await Showtime.find({ movie: movieId })
      .populate('theatre')
      .populate('movie');
    res.status(200).json({ success: true, showtimes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
