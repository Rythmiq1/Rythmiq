const cloudinary = require("cloudinary").v1;
const songModel = require("../Models/songModel");

const addSong = async (req, res) => {
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const album = req.body.album;
        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];

        // Upload all files to Cloudinary
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
            resource_type: "video"
        });

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image"
        });

        console.log(name, desc, album, audioUpload, imageUpload);
        
        // Send a response if needed
        res.status(200).json({ message: "Song uploaded successfully", audioUpload, imageUpload });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while uploading the song.");
    }
};

const listSong = async (req, res) => {
    // Logic for listing songs
};

module.exports = { addSong, listSong };
