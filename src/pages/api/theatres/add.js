import dbConnect from '@/lib/mongoose';
import Theatre from '@/models/Theatre';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  await dbConnect();

  const { theatreId, name, location, screen } = req.body;

  try {
    if (theatreId) {
      // Add screen to existing theatre
      const theatre = await Theatre.findById(theatreId);
      if (!theatre) return res.status(404).json({ success: false, error: 'Theatre not found' });

      theatre.screens.push(screen);
      await theatre.save();

      return res.status(200).json({ success: true, message: 'Screen added to existing theatre', theatre });
    } else {
      // Create new theatre with one screen
      const newTheatre = await Theatre.create({
        name,
        location,
        screens: [screen],
      });
      return res.status(201).json({ success: true, message: 'New theatre created with screen', theatre: newTheatre });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
