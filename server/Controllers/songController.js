import Album from '../Models/albumModel.js';
import Artist from '../Models/artist.js';
import UserModel from '../Models/User.js';
import songModel from '../Models/songModel.js';
import { uploadOnCloudinary } from '../config/cloudinary.js';
import { io } from '../index.js';

const addSong = async (req, res) => {
    try {
        const { name, desc, album, artist, type } = req.body; 
        const audioFile = req.files.audio ? req.files.audio[0] : null; 
        const imageFile = req.files.image ? req.files.image[0] : null; 

        if (!audioFile || !imageFile) {
            return res.status(400).json({
                success: false,
                message: "Audio and image files are required."
            });
        }

        // Check if the artist exists
        const artistExists = await Artist.findById(artist);
        if (!artistExists) {
            return res.status(404).json({
                success: false,
                message: "Artist not found."
            });
        }

        // Validate album if provided
        let albumId = null;
        if (album !== 'none' && album) {
            const albumExists = await Album.findById(album); // Assuming you have an Album model
            if (!albumExists) {
                return res.status(404).json({
                    success: false,
                    message: "Album not found."
                });
            }
            albumId = album; // Valid album ID
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

        // Create song data with album and artist references
        const songData = {
            name,
            desc,
            album: albumId, // Ensure album is set to valid ObjectId or null
            artist, // Artist ID
            type,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration
        };

        // Save the song to the database
        const newSong = new songModel(songData);
        await newSong.save();

        // Update artist's songs array
        artistExists.songs.push(newSong._id);
        await artistExists.save();

        console.log("Saved Song:", newSong);

        // Find all users following this artist
        const usersFollowingArtist = await UserModel.find({ followedArtists: artist });
        console.log("Users following the artist:", usersFollowingArtist);

        // Emit a notification to all users following this artist
        usersFollowingArtist.forEach(user => {
            console.log(`Sending notification to user: ${user._id}`);
            io.to(user._id.toString()).emit('new-song', {
                artistId: artist,
                songId: newSong._id,
                songName: newSong.name,
                message: `New song added by ${artistExists.name}: ${newSong.name}`
            });
            console.log('message sent');
        });

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

const listLastFiveSongs = async (req, res) => {
    try {
      // Fetch the last 5 songs, sorted by 'createdAt' in descending order
      const lastFiveSongs = await songModel
        .find({})
        .sort({ createdAt: -1 })  // Sort by 'createdAt' field, newest first
        .limit(5)                  // Limit the results to 5 songs
        .populate('album');        // Populate the 'album' field if needed
  
      res.json({ success: true, songs: lastFiveSongs });
    } catch (error) {
      console.error("Error fetching last 5 songs:", error);
      res.json({ success: false, message: "Failed to fetch last 5 songs" });
    }
  };
  

  
export { addSong, listSong, removeSong,listLastFiveSongs }