import Playlist from '../Models/PlaylistModel.js';
import UserModel from '../Models/User.js';
import { uploadOnCloudinary } from '../config/cloudinary.js'; 
import cors from 'cors';




export const createPlaylist = async (req, res) => {
    try {
        const { name, description } = req.body;
        const songs = req.body.songs;
        const imageFile = req.file;


        const songArray = Array.isArray(songs) ? songs : [songs]; 

        if (!name || !songArray || songArray.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Playlist name and songs are required.",
            });
        }

        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: "Image file is required.",
            });
        }

        const imageUpload = await uploadOnCloudinary(imageFile.path);
        if (!imageUpload) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload image to Cloudinary.",
            });
        }

        const newPlaylist = new Playlist({
            name,
            description,
            songs: songArray, 
            image: imageUpload.secure_url,
            createdBy: req.user.id,
        });

        await newPlaylist.save();
        const userId = req.user.userId || req.user._id; 
        await UserModel.findByIdAndUpdate(
            userId,
            { $addToSet: { createdPlaylists: newPlaylist._id } },
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "Playlist created successfully",
            playlist: newPlaylist,
        });
    } catch (error) {
        console.error("Error creating playlist:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create playlist",
            error: error.message,
        });
    }
};


export const getUserPlaylists = async (req, res) => {
    try {
        const userId = req.user.userId || req.user._id; 

        const user = await UserModel.findById(userId).populate('createdPlaylists');
        if (!user) 
        {
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

export const getPlaylistById = async (req, res) => {
    const { playlistId } = req.params;
    try {
        const playlist = await Playlist.findById(playlistId).populate('songs'); // Assuming 'songs' is a reference field
        if (!playlist) {
            return res.status(404).json({ success: false, message: 'Playlist not found' });
        }
        res.status(200).json({ success: true, playlist });
    } catch (error) {
        console.error('Error fetching playlist:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


export const getSavedPlaylistsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await UserModel.findById(userId).populate({
            path: 'savedPlaylists',
            populate: { path: 'songs' }, // Populate the songs in each playlist
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, playlists: user.savedPlaylists });
    } catch (error) {
        console.error('Error fetching saved playlists:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
export const removePlaylist = async (req, res) => {
    const { playlistId } = req.body;  // The playlistId is passed from the front-end body

    try {
        // 1. Find the Playlist by ID
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ success: false, message: 'Playlist not found' });
        }

        // 2. Remove the Playlist from the User's createdPlaylists
        const userId = req.user.userId || req.user._id;  // Get the user ID from the token
        await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { createdPlaylists: playlistId } },  // $pull removes the playlist from the createdPlaylists array
            { new: true }
        );

        // 3. Delete the Playlist
        await Playlist.findByIdAndDelete(playlistId);  // Delete the playlist from the database

        res.status(200).json({
            success: true,
            message: 'Playlist removed successfully',
        });
    } catch (error) {
        console.error('Error removing playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove playlist',
            error: error.message,
        });
    }
};
