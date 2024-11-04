import { signup, login, selectGenres } from '../Controllers/AuthController.js';
import { signupValidation, loginValidation } from '../Middlewares/AuthValidation.js';
import { ensureAuthenticated } from '../Middlewares/Auth.js';
import { addLikedSong,getLikedSongs,removeLikedSong } from '../Controllers/UserController.js';
import express from 'express';

const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/select-genres', ensureAuthenticated, selectGenres);
router.post('/like-song', ensureAuthenticated, addLikedSong);
router.get('/get-liked', ensureAuthenticated, getLikedSongs);
router.delete('/delete-like-song',ensureAuthenticated,removeLikedSong);

export default router;
