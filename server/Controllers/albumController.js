import { uploadOnCloudinary } from '../config/cloudinary.js';
import albumModel from "../Models/albumModel.js";

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
        // Getting all the data
        const allAlbums = await albumModel.find({});
        res.json({
            success: true,
            albums: allAlbums
        });
    } catch (error) {
        res.json({
            success: false
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

export { addAlbum, listAlbum, removeAlbum };
