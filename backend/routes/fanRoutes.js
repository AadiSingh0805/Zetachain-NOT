import express from 'express';
import {
  createFan,
  getFans,
  getFanById,
  updateFan,
  deleteFan,
  calculatePriorityScore,
  getEventPriorityQueue,
  getSpotifyInsights,
  updateSpotifyTokens
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

// Spotify integration routes
router.post('/:id/priority', calculatePriorityScore);
router.get('/:id/spotify/:artistId', getSpotifyInsights);
router.put('/:id/spotify', updateSpotifyTokens);

// Event queue routes
router.get('/event/:eventId/queue', getEventPriorityQueue);

export default router;