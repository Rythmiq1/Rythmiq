import Playlist from '../Models/PlaylistModel.js'; // Ensure this is the correct path to your model

const createPlaylist = async (req, res) => {
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

export { createPlaylist };
