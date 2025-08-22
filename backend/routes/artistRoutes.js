const express = require('express');
const {
  createArtist,
  getArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
} = require('../controllers/artistController.js');

const router = express.Router();

// Create an artist
router.post('/', createArtist);

// Get all artists
router.get('/', getArtists);

// Get a single artist by ID
router.get('/:id', getArtistById);

// Update an artist by ID
router.put('/:id', updateArtist);

// Delete an artist by ID
router.delete('/:id', deleteArtist);

module.exports = router;