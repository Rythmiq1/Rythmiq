// models/playlistModel.js
import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }], // reference to the Song model
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', playlistSchema);
export default Playlist;
