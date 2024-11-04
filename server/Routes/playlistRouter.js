import express from 'express';
import { createPlaylist } from '../Controllers/playlistController.js';
import { ensureAuthenticated } from '../Middlewares/Auth.js';// Adjust the path as necessary

const playlistRouter = express.Router();

playlistRouter.post("/create", ensureAuthenticated, createPlaylist);

export default playlistRouter;
