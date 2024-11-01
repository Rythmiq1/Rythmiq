const cloudinary = require("cloudinary").v2;
const albumModel= require("../Models/albumModel.js")

const addAlbum = async(req,res)=>{
    try{

        const name = req.body.name;
        const desc=req.body.desc;
        const bgColour=req.body.bgColour;
        const imageFile=req.file;
        //uploading img in cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type:"image"
        });

        const albumData={
            name,
            desc,
            bgColour,
            image:imageUpload.secure_url,
        }

        //storing data in Database
        const album =albumModel(albumData);
        await album.save();

        res.json({
            sucess:true,
            message:"Album Added Successfully",
        })
    }
    catch(error)
    {
        console.log(error);
        res.json({
            sucess:false,
            message:"cant add album",
        })

    }
}

const listAlbum = async(req,res)=>{
    try{
        //getting all the data
        const allAlbums = await albumModel.find({});
        res.json({
            sucess:true,
            albums:allAlbums
        })
    }
    catch(error)
    {
        res.json({
            success:false
        })
    }
}

const removeAlbum=async(req,res)=>{
    try{

        await albumModel.findByIdAndDelete(req.body.id);
        res.json({
            sucess:true,
            message:"Album Removed Successfully",
        })
    }
    catch(error)
    {
        res.json({
            sucess:false,
            message:"Couldnt remove album",
        })
    }
    

    
}


module.exports = { addAlbum, listAlbum ,removeAlbum};
