import { uploadOnCloudinary } from '../config/cloudinary.js';
import albumModel from "../Models/albumModel.js";
import Song from '../Models/songModel.js';
const addAlbum = async (req, res) => {
    try {
        const { name, desc, bgColour } = req.body; 
        const imageFile = req.file; 

        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: "Image file is required."
            });
        }

        // Uploading image to Cloudinary
        const imageUpload = await uploadOnCloudinary(imageFile.path);
        
        if (!imageUpload) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload image to Cloudinary."
            });
        }

        // Prepare the album data
        const albumData = {
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url,
        };

        // Storing data in the database
        const newAlbum = new albumModel(albumData);
        await newAlbum.save();

        // Log the saved album for debugging
        console.log("Saved Album:", newAlbum);

        // Respond with success message
        res.status(201).json({
            success: true,
            message: "Album added successfully.",
            albumId: newAlbum._id,
            data: newAlbum
        });
    } catch (error) {
        console.error("Error adding album:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};


const listAlbum = async (req, res) => {
    try {
        // Fetch all albums from the database
        const allAlbums = await albumModel.find({});

        // Check if albums were found
        if (allAlbums.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No albums found."
            });
        }

        // Respond with success message and the albums
        res.status(200).json({
            success: true,
            message: "Albums retrieved successfully.",
            albums: allAlbums
        });
    } catch (error) {
        console.error("Error fetching albums:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching albums."
        });
    }
};


const removeAlbum = async (req, res) => {
    try {
        await albumModel.findByIdAndDelete(req.body.id);
        res.json({
            success: true,
            message: "Album Removed Successfully",
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Couldn't remove album",
        });
    }
};
const getAlbumById = async (req, res) => {
    try {
        const albumId = req.params.albumId;
        const album = await albumModel.findById(albumId);

        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }

        // Fetch all songs associated with this album
        const songs = await Song.find({ album: albumId });

        res.json({
            album,
            songs,
        });
    } catch (error) {
        console.error("Error fetching album:", error);
        res.status(500).json({
            message: "Error fetching album",
            error: error.message,
        });
    }
};

  

export { addAlbum, listAlbum, removeAlbum ,getAlbumById};
