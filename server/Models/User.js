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
    // required: true,
  },
  googleId: String,
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
  createdPlaylists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
}, { timestamps: true });

const UserModel = mongoose.model('users', UserSchema);
export default UserModel;
