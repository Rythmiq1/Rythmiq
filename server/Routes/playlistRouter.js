// Routes/playlistRoutes.js
import express from 'express';
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById 
} from '../Controllers/playlistController.js';
import { ensureAuthenticated } from '../Middlewares/Auth.js';
import { upload } from "../Middlewares/multer.js";
const playlistRouter = express.Router();

playlistRouter.post("/create", ensureAuthenticated, upload.single('image'), createPlaylist);
playlistRouter.get("/my-playlists", ensureAuthenticated, getUserPlaylists);
playlistRouter.get('/:playlistId', getPlaylistById);
export default playlistRouter;
