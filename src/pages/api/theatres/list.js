// src/pages/api/theatres/list.js
import dbConnect from '@/lib/mongoose';
import Theatre from '@/models/Theatre';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  await dbConnect();

  try {
    const theatres = await Theatre.find({});
    res.status(200).json({ success: true, theatres });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
