import { signup, login, selectGenres } from '../Controllers/AuthController.js';
import { signupValidation, loginValidation } from '../Middlewares/AuthValidation.js';
import { ensureAuthenticated } from '../Middlewares/Auth.js';

import express from 'express';

const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/select-genres', ensureAuthenticated, selectGenres);

export default router;
