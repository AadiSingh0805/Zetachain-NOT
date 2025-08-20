import express from 'express';
import {
  createFan,
  getFans,
  getFanById,
  updateFan,
  deleteFan,
} from '../controllers/fanController.js';

const router = express.Router();

// Create a fan
router.post('/', createFan);

// Get all fans
router.get('/', getFans);

// Get a single fan by ID
router.get('/:id', getFanById);

// Update a fan by ID
router.put('/:id', updateFan);

// Delete a fan by ID
router.delete('/:id', deleteFan);

export default router;