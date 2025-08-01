import dbConnect from '@/lib/mongoose';
import Theatre from '@/models/Theatre';
import Movie from '@/models/Movie';
import Showtime from '@/models/Showtime';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  await dbConnect();

  try {
    // Get current date for showtime filtering (this week)
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
    
    // Format dates to match the string format used in showtimes
    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

    // Count theatres
    const theatreCount = await Theatre.countDocuments({});

    // Count movies
    const movieCount = await Movie.countDocuments({});

    // Count showtimes for this week
    const showtimeCount = await Showtime.countDocuments({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Count users
    const userCount = await User.countDocuments({});

    res.status(200).json({
      success: true,
      stats: {
        theatres: theatreCount,
        movies: movieCount,
        showtimes: showtimeCount,
        users: userCount
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
}
