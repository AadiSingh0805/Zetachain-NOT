

const express = require('express');
const {
  createFan,
  getFans,
  getFanById,
  updateFan,
  deleteFan,
  getAllSpotifyArtistStats,
  joinQueue,
  saveSpotifyAccessToken,
  calculateArtistPriority
} = require('../controllers/fanController.js');

const router = express.Router();

// Calculate priority score for an artist
router.post('/:fanId/priority', calculateArtistPriority);


// TEMP: Get all artists ranked by listening time for last 30 days
router.get('/:id/spotify/insights/all', getAllSpotifyArtistStats);

// Join queue endpoint
router.post('/:id/priority', joinQueue);


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

module.exports = router;