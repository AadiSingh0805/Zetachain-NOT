import express from 'express';
import { createArtist, getArtists } from '../controllers/artistController.js';

const router = express.Router();

router.post('/', createArtist);
router.get('/', getArtists);

export default router;