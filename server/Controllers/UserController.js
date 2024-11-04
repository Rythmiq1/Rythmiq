// server/Controllers/UserController.js

import UserModel from '../Models/User.js';
import Song from '../Models/songModel.js';

export const addLikedSong = async (req, res) => {
    try {
        const { songId } = req.body;

        if (!songId) {
            return res.status(400).json({ success: false, message: "Song ID is required." });
        }

        const userId = req.user.userId || req.user._id;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $addToSet: { likedSongs: songId } }, // Use $addToSet to avoid duplicates
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({
            success: true,
            message: "Song added to liked songs successfully",
            data: updatedUser
        });
    } catch (err) {
        console.error("Error adding liked song:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// Function to view liked songs with details
export const getLikedSongs = async (req, res) => {
  try {
      // Check if user ID is available
      const userId = req.user.userId || req.user._id;
      console.log("User ID:", userId);

      if (!userId) {
          return res.status(403).json({
              success: false,
              message: "User not authenticated."
          });
      }

      // Fetch user with populated liked songs
      const user = await UserModel.findById(userId).populate("likedSongs");

      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found."
          });
      }

      // Return liked songs if found
      res.status(200).json({
          success: true,
          message: "Liked songs fetched successfully.",
          data: user.likedSongs
      });
  } catch (err) {
      console.error("Error fetching liked songs:", err); // Log error for debugging
      res.status(500).json({
          success: false,
          message: "Internal server error"
      });
  }
};
export const removeLikedSong = async (req, res) => {
  try {
      const { songId } = req.body;

      if (!songId) {
          return res.status(400).json({ success: false, message: "Song ID is required." });
      }

      const userId = req.user.userId || req.user._id;

      const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { $pull: { likedSongs: songId } }, // Use $pull to remove the song
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).json({ success: false, message: "User not found." });
      }

      res.status(200).json({
          success: true,
          message: "Song removed from liked songs successfully",
          data: updatedUser
      });
  } catch (err) {
      console.error("Error removing liked song:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const addCreatedPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.body;

        // Validate that playlistId is provided
        if (!playlistId) {
            return res.status(400).json({ success: false, message: "Playlist ID is required." });
        }

        const userId = req.user.userId || req.user._id; // Get the user's ID from the request

        // Update the user to add the playlistId to createdPlaylists
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $addToSet: { createdPlaylists: playlistId } }, // Use $addToSet to avoid duplicates
            { new: true }
        );

        // Check if the user was found and updated
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({
            success: true,
            message: "Playlist ID added to user's created playlists successfully",
            data: updatedUser
        });
    } catch (err) {
        console.error("Error adding created playlist:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};