import express from 'express';
import {upload} from "../Middlewares/multer.js";
import { addArtist ,listArtists,getArtistById} from '../Controllers/artistController.js';
const ArtistRouter = express.Router();
ArtistRouter.post("/adda",upload.single('image'),addArtist);
ArtistRouter.get('/artists',listArtists);
ArtistRouter.get('/artists/:id', getArtistById);

export default ArtistRouter;