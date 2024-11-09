import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true, // Leave commented if using only OAuth for login
  },
  googleId: { type: String, unique: true, sparse: true },
  spotifyId: { type: String, unique: true, sparse: true },
  googleAccessToken: String,
  spotifyAccessToken: String,
  spotifyRefreshToken: String,
  image: String,
  interests: {
    type: [String],
    default: [],
  },
  likedSongs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
  followedArtists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
    },
  ],
  createdPlaylists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  savedPlaylists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }]
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
