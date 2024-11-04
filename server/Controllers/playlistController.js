// Controllers/playlistController.js
import Playlist from '../Models/PlaylistModel.js';
import UserModel from '../Models/User.js'; // Import the User model

// Function to create a playlist
export const createPlaylist = async (req, res) => {
    try {
        const { name, description, songs } = req.body;

        // Validate the request body
        if (!name || !songs || !Array.isArray(songs) || songs.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Playlist name and songs are required.",
            });
        }

        // Create the playlist
        const newPlaylist = new Playlist({
            name,
            description,
            songs,
            createdBy: req.user.id, // Assuming you're using some auth middleware
        });

        await newPlaylist.save();

        // After creating the playlist, add the playlist ID to the user's createdPlaylists
        const userId = req.user.userId || req.user._id; // Get user ID from request
        await UserModel.findByIdAndUpdate(
            userId,
            { $addToSet: { createdPlaylists: newPlaylist._id } }, // Add the playlist ID
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "Playlist created successfully",
            playlist: newPlaylist,
        });
    } catch (error) {
        console.error("Error creating playlist:", error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Failed to create playlist",
            error: error.message, // Send the error message for more details
        });
    }
};

// Function to get playlists created by the user
export const getUserPlaylists = async (req, res) => {
    try {
        const userId = req.user.userId || req.user._id; // Get user ID from request

        const user = await UserModel.findById(userId).populate('createdPlaylists'); // Populate createdPlaylists
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User playlists retrieved successfully",
            playlists: user.createdPlaylists,
        });
    } catch (error) {
        console.error("Error retrieving user playlists:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
