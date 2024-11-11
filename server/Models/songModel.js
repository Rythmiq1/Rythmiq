// song.js
import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "album",
    required: false,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Song = mongoose.models.Song || mongoose.model("Song", songSchema);
export default Song;
