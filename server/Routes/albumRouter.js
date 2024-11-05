import { addAlbum, listAlbum, removeAlbum, getAlbumById } from "../Controllers/albumController.js";
import express from "express";
import {upload} from "../Middlewares/multer.js";

const albumRouter = express.Router();

albumRouter.post("/add", upload.single('image'), addAlbum);
albumRouter.get("/list", listAlbum);
albumRouter.delete("/remove", removeAlbum);
albumRouter.get("/:albumId", getAlbumById);
export default albumRouter;
