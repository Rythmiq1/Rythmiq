import { signup, login } from '../Controllers/AuthController.js';
import { signupValidation, loginValidation } from '../Middlewares/AuthValidation.js';
import { ensureAuthenticated } from '../Middlewares/Auth.js';
import { addLikedSong,getLikedSongs,removeLikedSong,getSavedPlaylists, 
  addSavedPlaylist,followArtist,getFollowedArtists,selectInterests } from '../Controllers/UserController.js';
import express from 'express';

const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/select-interest', ensureAuthenticated,selectInterests);
router.post('/like-song', ensureAuthenticated, addLikedSong);
router.get('/get-liked', ensureAuthenticated, getLikedSongs);
router.delete('/delete-like-song',ensureAuthenticated,removeLikedSong);
router.get('/saved-playlists', ensureAuthenticated, getSavedPlaylists);
router.post('/save-playlist/:playlistId', ensureAuthenticated, addSavedPlaylist);
router.post('/follow-artist',ensureAuthenticated, followArtist);
router.get('/all-followed-artists',ensureAuthenticated, getFollowedArtists);
export default router;
