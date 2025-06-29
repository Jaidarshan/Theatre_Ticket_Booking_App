import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  posterUrl: String,
  duration: Number,         
  genre: [String],          
  language: String,
  certificate: String,      
  releaseDate: Date,
  theatres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' }],
}, { timestamps: true });

export default mongoose.models.Movie || mongoose.model('Movie', movieSchema);
