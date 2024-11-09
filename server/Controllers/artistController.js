import Artist from '../Models/artist.js';
import { uploadOnCloudinary } from '../config/cloudinary.js';
export const addArtist = async (req, res) => {
  try {
      const { name, bio } = req.body;
      const imageFile = req.files?.image ? req.files.image[0] : null;

      if (!name || !bio) {
          return res.status(400).json({
              success: false,
              message: "Name and bio are required."
          });
      }

      // If there's an image file, upload it to Cloudinary
      let imageUrl = '';
      if (imageFile) {
          const imageUpload = await uploadOnCloudinary(imageFile.path);
          if (!imageUpload) {
              return res.status(500).json({
                  success: false,
                  message: "Failed to upload image to Cloudinary."
              });
          }
          imageUrl = imageUpload.secure_url;
      }

      // Create artist data
      const artistData = {
          name,
          bio,
          image: imageUrl || undefined, // Only include image if uploaded
      };

      // Save artist to the database
      const newArtist = new Artist(artistData);
      await newArtist.save();

      res.status(201).json({
          success: true,
          message: "Artist added successfully.",
          data: newArtist
      });
  } catch (err) {
      console.error("Error adding artist:", err);
      res.status(500).json({
          success: false,
          message: "Internal server error."
      });
  }
};
export const listArtists = async (req, res) => {
  try {
      // Fetch all artists from the database
      const artists = await Artist.find();
      
      res.status(200).json({
          success: true,
          message: "List of artists retrieved successfully.",
          data: artists
      });
  } catch (error) {
      console.error("Error fetching artists:", error);
      res.status(500).json({
          success: false,
          message: "Internal server error."
      });
  }
};
