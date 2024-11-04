// Routes/playlistRoutes.js
import express from 'express';
import {
  createPlaylist,
  getUserPlaylists, // Import the getUserPlaylists function
} from '../Controllers/playlistController.js';
import { ensureAuthenticated } from '../Middlewares/Auth.js';

const playlistRouter = express.Router();

// Route to create a playlist
playlistRouter.post("/create", ensureAuthenticated, createPlaylist);

// Route to get playlists created by the user
playlistRouter.get("/my-playlists", ensureAuthenticated, getUserPlaylists);

export default playlistRouter;
