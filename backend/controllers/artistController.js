const Artist = require('../models/artistModel.js');

// Create a new artist
const createArtist = async (req, res) => {
  try {
    const artist = new Artist(req.body);
    await artist.save();
    res.status(201).json(artist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all artists
const getArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single artist by ID
const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ message: 'Artist not found' });
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an artist by ID
const updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!artist) return res.status(404).json({ message: 'Artist not found' });
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an artist by ID
const deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) return res.status(404).json({ message: 'Artist not found' });
    res.status(200).json({ message: 'Artist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createArtist,
  getArtists,
  getArtistById,
  updateArtist,
  deleteArtist
};