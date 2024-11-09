import express from 'express';
import {upload} from "../Middlewares/multer.js";
import { addArtist ,listArtists} from '../Controllers/artistController.js';
const ArtistRouter = express.Router();
ArtistRouter.post("/adda",upload.single('image'),addArtist);
ArtistRouter.get('/artists',listArtists);

export default ArtistRouter;