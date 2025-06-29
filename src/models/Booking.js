import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime' },
  seats: [String],
  paymentStatus: String,
}, { timestamps: true });
export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);