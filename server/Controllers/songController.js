
import songModel from '../Models/songModel.js';
import { uploadOnCloudinary } from '../config/cloudinary.js';
const addSong = async (req, res) => {
    try {
        const { name, desc, album } = req.body; 
        const audioFile = req.files.audio[0]; 
        const imageFile = req.files.image[0]; 
        if (!audioFile || !imageFile) {
            return res.status(400).json({
                success: false,
                message: "Audio and image files are required."
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

        // Calculate duration
        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;

        // Prepare the song data
        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration
        };

        // Save the song to the database
        const newSong = new songModel(songData);
        await newSong.save();

        // Log the saved song for debugging
        console.log("Saved Song:", newSong);

        // Respond with success message
        res.status(201).json({
            success: true,
            message: "Song added successfully.",
            songId: newSong._id,
            data: newSong
        });
    } catch (err) {
        console.error("Error adding song:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};



const listSong = async (req, res) => {

    try {

        const allSongs = await songModel.find({});
        res.json({ success: true, songs: allSongs });

    } catch (error) {

        res.json({ success: false });
        
    }

}

const removeSong = async (req, res) => {

    try {

        await songModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Song Remove" });

    } catch (error) {

        res.json({ success: false });
        
    }

}

export { addSong, listSong, removeSong }