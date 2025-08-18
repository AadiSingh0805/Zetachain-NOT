import express from 'express';
import { createFan, getFans } from '../controllers/fanController.js';

const router = express.Router();

router.post('/', createFan);
router.get('/', getFans);

export default router;