import dbConnect from '@/lib/mongoose';
import Showtime from '@/models/Showtime';
import Movie from '@/models/Movie';
import Theatre from '@/models/Theatre';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { movieId, theatreId, screenName, date, time, price } = req.body;

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    const screen = theatre.screens?.find(s => s.name === screenName);
    if (!screen) {
      return res.status(404).json({ success: false, message: 'Screen not found' });
    }

    const seats = [];

    const { rows = 0, cols = 0 } = screen.seatLayout || {};
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        seats.push({
          number: `M${r + 1}-${c + 1}`,
          booked: false,
          user: null,
        });
      }
    }

    if (screen.hasBalcony && screen.balconyLayout) {
      const { left, right } = screen.balconyLayout;

      if (left) {
        for (let r = 0; r < left.rows; r++) {
          for (let c = 0; c < left.cols; c++) {
            seats.push({
              number: `BL${r + 1}-${c + 1}`,
              booked: false,
              user: null,
            });
          }
        }
      }

      if (right) {
        for (let r = 0; r < right.rows; r++) {
          for (let c = 0; c < right.cols; c++) {
            seats.push({
              number: `BR${r + 1}-${c + 1}`,
              booked: false,
              user: null,
            });
          }
        }
      }
    }

    const newShowtime = await Showtime.create({
      movie: movieId,
      theatre: theatreId,
      screenName,
      date,
      time,
      price,
      seats,
    });

    await Movie.findByIdAndUpdate(movieId, {
      $addToSet: { theatres: theatreId },
    });

    res.status(201).json({ success: true, showtime: newShowtime });
  } catch (error) {
    console.error('Error adding showtime:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
