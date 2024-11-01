const cloudinary = require("cloudinary").v1;
const songModel = require("../Models/songModel");
const math = require('mathjs');


const addSong = async (req, res) => {
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const album = req.body.album;
        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];
        //calculate time in minutes:seconds
        const duration =`${math.floor(audioUpload.duration/60)}:${math.floor(audioUpload.duration%60)}`

        // Upload all files to Cloudinary
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
            resource_type: "video"
        });

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image"
        });

        const songData={
            name,
            desc,
            album,
            image:imageUpload.secure_url,
            file:audioUpload.secure_url,
            duration
        }

        const song=songModel(songData);
        //saving data in Database
        await song.save();

        res.json({
            success:true,
            message:"Song Added Successfully",
        });

        console.log(name, desc, album, audioUpload, imageUpload);
        
        // Send a response if needed
        res.status(200).json({ message: "Song uploaded successfully", audioUpload, imageUpload });
    }
     catch (error) 
     {
        console.error(error);
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
