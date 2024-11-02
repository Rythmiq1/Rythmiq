import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const mongo_url = process.env.MONGO_CONN;

mongoose.connect(mongo_url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log('MongoDB Connection error', err);
  });
