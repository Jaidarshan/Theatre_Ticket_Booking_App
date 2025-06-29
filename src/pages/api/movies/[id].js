// src/pages/api/movies/[id].js
import dbConnect from '@/lib/mongoose';
import Movie from '@/models/Movie';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();
  try {
    const movie = await Movie.findById(id).populate('theatres');
    if (!movie) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
