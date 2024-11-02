const cloudinary = require("../config/cloudinary").v2;
const songModel = require("../Models/songModel");
const math = require('mathjs');


const addSong = async (req, res) => {
    try {
        // Extract the song details and files
        const { name, desc, album } = req.body;
        const audioFile = req.files.audio[0]; // Ensure files exist
        const imageFile = req.files.image[0];

        if (!audioFile || !imageFile) {
            return res.status(400).send("Both audio and image files are required.");
        }

        // Log the files to check they are being received correctly
        console.log("Received files:", req.files);

        // Upload audio to Cloudinary
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
            resource_type: "video", // Audio files are treated as video in Cloudinary
        });

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
        });

        // Calculate duration if needed (make sure to handle the audio file appropriately)
        // Assuming you have a way to get the duration here; replace this with your logic.
        const duration = "0:00"; // Replace with actual logic

        // Prepare song data for saving to DB
        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration,
        };

        // Save the song to your database (assuming you have a songModel)
        const song = new songModel(songData);
        await song.save();

        res.status(200).json({
            success: true,
            message: "Song Added Successfully",
        });

    } catch (error) {
        console.error("Error in addSong:", error);
        res.status(500).send("An error occurred while uploading the song.");
    }
};


const listSong = async (req, res) => {
    try{
        //getting all the data from song model
        const allSongs = await songModel.find({});
        res.json({
            success:true,
            songs:allSongs
        });
    }
    catch(error)
    {
        res.json(
            {
                success:false,
                message:"Error Occured while listing all songs"
            }
        )
    }
};


const removeSong = async(req,res)=>{
    try{
        const songId = req.body.id;
        await songModel.findByIdAndDelete(songId);
        res.json({
            success:true,
            message:"Song Removed Successfully"
            });

    }
    catch(error)
    {
        res.json({
            success:false,
            message:"Error occured while removing song"
            });
    }
}

module.exports = { addSong, listSong ,removeSong};
