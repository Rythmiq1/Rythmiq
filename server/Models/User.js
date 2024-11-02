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
    type: [String], // Array of strings
    default: [],
  },
}, { timestamps: true });

const UserModel = mongoose.model('users', UserSchema);
export default UserModel;
