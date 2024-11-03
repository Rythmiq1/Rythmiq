import Album from '../Models/albumModel.js';
import songModel from '../Models/songModel.js';
import { uploadOnCloudinary } from '../config/cloudinary.js';
const addSong = async (req, res) => {
    try {
        const { name, desc, album } = req.body; 
        const audioFile = req.files.audio ? req.files.audio[0] : null; 
        const imageFile = req.files.image ? req.files.image[0] : null; 

        if (!audioFile || !imageFile) {
            return res.status(400).json({
                success: false,
                message: "Audio and image files are required."
            });
        }

        // Check if the album exists
        const albumExists = await Album.findById(album);
        if (!albumExists) {
            return res.status(404).json({
                success: false,
                message: "Album not found."
            });
        }

        const audioUpload = await uploadOnCloudinary(audioFile.path);
        const imageUpload = await uploadOnCloudinary(imageFile.path);

        if (!audioUpload || !imageUpload) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload files to Cloudinary."
            });
        }

        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;

        // Create song data with album reference
        const songData = {
            name,
            desc,
            album, // Use the album ID here
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration
        };

        // Save the song to the database
        const newSong = new songModel(songData);
        await newSong.save();

        console.log("Saved Song:", newSong);

        res.status(201).json({
            success: true,
            message: "Song added successfully.",
            songId: newSong._id,
            data: newSong
        });
    } catch (err) {
        console.error("Error adding song:", err); // Log full error
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};


const listSong = async (req, res) => {
    try {
        // Populate the 'album' field when fetching songs
        const allSongs = await songModel.find({}).populate('album'); 
        res.json({ success: true, songs: allSongs });
    } catch (error) {
        console.error("Error fetching songs:", error);
        res.json({ success: false });
    }
};

const removeSong = async (req, res) => {

    try {

        await songModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Song Remove" });

    } catch (error) {

        res.json({ success: false });
        
    }

}

export { addSong, listSong, removeSong }