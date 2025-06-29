import dbConnect from '@/lib/mongoose';
import Movie from '@/models/Movie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const {
      title,
      description,
      posterUrl,
      duration,
      genre,
      language,
      certificate,
      releaseDate
    } = req.body;

    const newMovie = await Movie.create({
      title,
      description,
      posterUrl,
      duration,
      genre,
      language,
      certificate,
      releaseDate,
      theatres: []
    });

    res.status(201).json({ success: true, movie: newMovie });
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
