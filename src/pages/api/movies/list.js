import dbConnect from '@/lib/mongoose';
import Movie     from '@/models/Movie';
import Theatre  from '@/models/Theatre'; 

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    await dbConnect();
    const movies = await Movie.find({}).populate('theatres');
    return res.status(200).json({ success: true, movies });
  } catch (error) {
    console.error('🛑 /api/movies/list error:', error);
    return res
      .status(500)
      .json({ success: false, error: error.message });
  }
}
