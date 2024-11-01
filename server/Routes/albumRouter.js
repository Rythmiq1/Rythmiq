const { addAlbum, listAlbum, removeAlbum } = require("../Controllers/albumController.js");
const express = require("express");

const upload = require("../Middlewares/multer.js");  

const albumRouter = express.Router();

albumRouter.post("/add", upload.single('image'), addAlbum);
albumRouter.get("/list", listAlbum);
albumRouter.delete("/remove", removeAlbum);

module.exports = albumRouter;  
