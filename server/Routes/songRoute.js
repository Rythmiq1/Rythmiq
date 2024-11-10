import { addSong, listSong, removeSong ,listLastFiveSongs} from "../Controllers/songController.js";
import express from "express";
import {upload} from "../Middlewares/multer.js";

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
songRouter.get("/last5",listLastFiveSongs);
export default songRouter;
