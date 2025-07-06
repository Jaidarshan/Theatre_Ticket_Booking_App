// pages/api/showtimes/[id].js
import dbConnect from '@/lib/mongoose';
import Showtime from '@/models/Showtime';
import Theatre from '@/models/Theatre';
import Movie from '@/models/Movie';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  await dbConnect();

  const { id } = req.query;

  try {
    const showtime = await Showtime.findById(id)
      .populate('movie')
      .populate('theatre');

    if (!showtime) return res.status(404).json({ error: 'Showtime not found' });

    res.status(200).json({ success: true, showtime });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}