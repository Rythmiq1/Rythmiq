// server/Controllers/UserController.js
import Artist from '../Models/artist.js';
import UserModel from '../Models/User.js';
import Song from '../Models/songModel.js';
import Playlist from '../Models/PlaylistModel.js';
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
export const removeSavedPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.body;

        if (!playlistId) {
            return res.status(400).json({ success: false, message: "Playlist ID is required." });
        }

        const userId = req.user.userId || req.user._id; // Get the user ID from the request

        // Find the user and remove the playlistId from their savedPlaylists array
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { savedPlaylists: playlistId } }, // $pull to remove playlist from savedPlaylists array
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({
            success: true,
            message: "Playlist removed from saved playlists successfully.",
            savedPlaylists: updatedUser.savedPlaylists // Optionally return the updated saved playlists list
        });
    } catch (err) {
        console.error("Error removing saved playlist:", err);
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
// getSavedPlaylists function (your code is mostly correct, so no changes needed here)
export const getSavedPlaylists = async (req, res) => {
    const userId = req.user.userId || req.user._id;  // Get userId from the authenticated user
  
    try {
      // Query the user and populate savedPlaylists
      const user = await UserModel.findById(userId).populate('savedPlaylists');
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      return res.status(200).json({ success: true, savedPlaylists: user.savedPlaylists });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Error fetching saved playlists' });
    }
};

export const addSavedPlaylist = async (req, res) => {
    try {
      const { playlistId } = req.params;
  
      if (!playlistId) {
        return res.status(400).json({ success: false, message: "Playlist ID is required." });
      }
  
      const userId = req.user.userId || req.user._id;
  
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $addToSet: { savedPlaylists: playlistId } }, 
        { new: true }
      );
  
    
      if (!updatedUser) 
      {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      res.status(200).json({
        success: true,
        message: "Playlist added to saved playlists successfully",
        data: updatedUser
      });
    } 
    catch (err) 
    {
      console.error("Error adding saved playlist:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  export const followArtist = async (req, res) => {
    try {
        const { artistId } = req.body;  // Only need the artistId to follow an artist

        // Check if the artist exists
        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ success: false, message: "Artist not found" });
        }

        // Get the userId from the authenticated user (using req.user from JWT or session)
        const userId = req.user._id;

        // Find user and update their followed artists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Add artist to the followedArtists array if not already followed
        if (!user.followedArtists.includes(artistId)) {
            user.followedArtists.push(artistId);
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: `You are now following ${artist.name}.`,
            followedArtists: user.followedArtists
        });
    } catch (error) {
        console.error("Error following artist:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};
export const getFollowedArtists = async (req, res) => {
    try {
        // Get the userId from the authenticated user (using req.user from JWT or session)
        const userId = req.user._id;

        // Find the user and populate their followedArtists array
        const user = await UserModel.findById(userId).populate('followedArtists');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            followedArtists: user.followedArtists
        });
    } catch (error) {
        console.error("Error retrieving followed artists for user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const unfollowArtist = async (req, res) => {
    try {
        const { artistId } = req.body;

        if (!artistId) {
            return res.status(400).json({ success: false, message: "Artist ID is required." });
        }

        const userId = req.user.userId || req.user._id; // Get the user ID from the request

        // Find the user and remove the artistId from their followedArtists array
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { followedArtists: artistId } }, // $pull to remove artist from followedArtists array
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({
            success: true,
            message: "Artist unfollowed successfully.",
            followedArtists: updatedUser.followedArtists // Optionally return the updated followed artists list
        });
    } catch (err) {
        console.error("Error unfollowing artist:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const selectInterests = async (req, res) => {
    try {
        const { artistIds } = req.body;

        // Ensure at least 3 artist IDs are selected
        if (!Array.isArray(artistIds) || artistIds.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Please select at least 3 artists."
            });
        }

        // Get the userId from req.user (check for existence first)
        const userId = req.user?.userId || req.user?._id;

        if (!userId) {
            return res.status(403).json({
                success: false,
                message: "User ID not found in request."
            });
        }

        // Iterate through the artistIds one by one and update the user's interests
        for (let artistId of artistIds) {
            // Check if artistId is valid by looking it up in the Artist collection
            const artist = await Artist.findById(artistId);

            if (!artist) {
                return res.status(400).json({
                    success: false,
                    message: `Artist with ID ${artistId} does not exist.`
                });
            }

            // Add the valid artist to the user's interests (if not already present)
            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found."
                });
            }

            // Check if the artist is already in the user's interests to avoid duplicates
            if (!user.interests.includes(artistId)) {
                user.interests.push(artistId);
                await user.save(); // Save the updated user document
            }
        }

        // After all updates, send success response
        const updatedUser = await UserModel.findById(userId).populate('interests'); // Populate artist details

        res.status(200).json({
            success: true,
            message: "Interests selected successfully",
            data: updatedUser
        });

    } catch (err) {
        console.error("Error saving interests:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Helper function to analyze song history and get the top song types (genres)
const analyzeSongHistory = (songHistory) => {
  const typeCount = {};

  // Count how many times each type has been listened to
  songHistory.forEach(song => {
    if (typeCount[song.type]) {
      typeCount[song.type]++;
    } else {
      typeCount[song.type] = 1;
    }
  });

  // Sort types by frequency (descending order)
  const sortedTypes = Object.entries(typeCount).sort((a, b) => b[1] - a[1]);

  // Return top 3 types or fewer if there are less
  return sortedTypes.slice(0, 3).map(type => type[0]);
};

export const getRecommendations = async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?._id;
    
      const user = await UserModel.findById(userId).populate('interests');
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const songHistory = req.body.songHistory || [];
    
      let topTypes = [];
      if (songHistory.length > 0) {
       
        topTypes = analyzeSongHistory(songHistory);
      } else {
        
        topTypes = ["pop", "rock", "hip-hop", "electronic"];
      }
      
      const songsByType = await Song.find({ type: { $in: topTypes } }).limit(20);
      const artistIds = user.interests.map(artist => artist._id);
      const artists = await Artist.find({ _id: { $in: artistIds } }).populate('songs');
    

    let songsByInterest = [];
    artists.forEach(artist => {
    
    songsByInterest = [...songsByInterest, ...artist.songs];
    });
      const combinedSongs = [...songsByType, ...songsByInterest];

      const uniqueSongs = combinedSongs.filter((song, index, self) =>
        index === self.findIndex((t) => (
          t._id.toString() === song._id.toString()
        ))
      );
  
      res.status(200).json({ recommendations: uniqueSongs });
    } catch (error) {
      console.error("Error generating recommendations:", error.message || error);
      res.status(500).json({ error: error.message || "Failed to generate recommendations" });
    }
  };
  
  
