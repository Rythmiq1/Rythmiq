const { addSong, listSong ,removeSong} = require("../Controllers/songController.js");
const express = require("express");
const upload = require("../Middlewares/multer.js");

const songRouter = express.Router();

songRouter.post("/add", upload.fields([
  {
    name: 'image',
    maxCount: 1,
  },
  {
    name: 'audio',
    maxCount: 1,
  }
]), addSong);

songRouter.get("/list", listSong);
songRouter.post("/remove", removeSong);
module.exports = songRouter;
