import mongoose from 'mongoose';
const showtimeSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
  date: String,
  time: String,
  price: Number,
  seats: [
    {
      number: String,
      booked: { type: Boolean, default: false },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
}, { timestamps: true });
export default mongoose.models.Showtime || mongoose.model('Showtime', showtimeSchema);