import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Incorrect password' });

    res.status(200).json({
      success: true,
      user: {
        _id: user._id, 
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
