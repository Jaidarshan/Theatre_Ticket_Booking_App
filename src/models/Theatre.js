import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
  name: String,
  seatLayout: {
    rows: Number,
    cols: Number,
  },
  hasBalcony: {
    type: Boolean,
    default: false,
  },
  balconyLayout: {
    left: { rows: Number, cols: Number },
    right: { rows: Number, cols: Number },
  },
}, { _id: false });

const theatreSchema = new mongoose.Schema({
  name: String,
  location: String,
  screens: [screenSchema]
}, { timestamps: true });

export default mongoose.models.Theatre || mongoose.model('Theatre', theatreSchema);
