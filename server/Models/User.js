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
  googleAccessToken: String,
  interests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
    },
  ],
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
