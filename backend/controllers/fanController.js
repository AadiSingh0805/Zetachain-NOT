// Helper: Calculate priority score for an artist
function calculatePriorityScore({ totalPlays, totalListeningHours, playFrequency, completionRate }) {
  // Clamp values to max points
  const playsContribution = Math.min(totalPlays * 2, 80);
  const timeContribution = Math.min(totalListeningHours * 10, 60);
  const frequencyContribution = Math.min(playFrequency * 5, 40);
  const engagementContribution = Math.round(Math.min(completionRate * 20, 20));
  const priorityScore = playsContribution + timeContribution + frequencyContribution + engagementContribution;
  return {
    priorityScore,
    explanation: {
      playsContribution,
      timeContribution,
      frequencyContribution,
      engagementContribution
    }
  };
}

// POST /api/fans/:fanId/priority
const calculateArtistPriority = async (req, res) => {
  try {
    const { eventId, artistId } = req.body;
    const fanId = req.params.fanId;
    let fan = null;
    if (/^[a-fA-F0-9]{24}$/.test(fanId)) {
      fan = await Fan.findById(fanId);
    } else {
      fan = await Fan.findOne({ supabaseId: fanId });
    }
    if (!fan || !fan.spotifyAccessToken) {
      return res.status(404).json({ message: 'Fan or Spotify token not found' });
    }
    // Fetch all plays in last 30 days
    const allStats = await getAllArtistListeningStats(fan.spotifyAccessToken);
    const artistStats = allStats.find(a => a.artistId === artistId);
    if (!artistStats) {
      return res.status(404).json({ message: 'No listening data for this artist in last 30 days' });
    }
    // Calculate play frequency (per day)
    const playFrequency = Math.round((artistStats.totalPlays / 30) * 100) / 100;
    // Estimate completion rate: assume 1 if no skip data (Spotify API limitation)
    const completionRate = 1.0;
    const metrics = {
      totalPlays: artistStats.totalPlays,
      totalListeningTime: artistStats.totalListeningTime,
      totalListeningHours: artistStats.totalListeningHours,
      uniqueTracks: artistStats.uniqueTracks,
      playFrequency,
      completionRate
    };
    const { priorityScore, explanation } = calculatePriorityScore({
      totalPlays: artistStats.totalPlays,
      totalListeningHours: artistStats.totalListeningHours,
      playFrequency,
      completionRate
    });
    res.json({
      message: 'Priority calculated from recent listening data',
      priorityScore,
      metrics,
      explanation
    });
  } catch (error) {
    console.error('Priority Score Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const Fan = require('../models/fanModel.js');
const { getAllArtistListeningStats } = require('./spotifyStatsTemp.js');
// TEMP: Get all artists ranked by listening time for last 30 days
// TEMP: Join queue endpoint for testing
const joinQueue = async (req, res) => {
  try {
    // You can implement real logic here later
    res.json({ message: 'Join queue endpoint hit!' });
  } catch (error) {
    console.error('Join Queue Error:', error);
    res.status(500).json({ message: error.message });
  }
};
const getAllSpotifyArtistStats = async (req, res) => {
  try {
    // Accept access token from query param, header, or body
    const accessToken = req.query.accessToken || req.headers['x-spotify-access-token'] || req.body.accessToken;
    if (!accessToken) {
      return res.status(400).json({ message: 'Spotify access token required as ?accessToken=... or header x-spotify-access-token' });
    }
    console.log('Received Spotify access token:', accessToken);
    const stats = await getAllArtistListeningStats(accessToken);
    res.json({ stats });
  } catch (error) {
    console.error('Spotify Insights Error:', error);
    res.status(500).json({ message: error.message });
  }
}

// Save Spotify access token to Fan after OAuth (stub, call this after OAuth in your auth flow)
const saveSpotifyAccessToken = async (req, res) => {
  try {
    const { supabaseId, spotifyAccessToken } = req.body;
    if (!supabaseId || !spotifyAccessToken) {
      return res.status(400).json({ message: 'supabaseId and spotifyAccessToken required' });
    }
    const fan = await Fan.findOneAndUpdate(
      { supabaseId },
      { spotifyAccessToken },
      { new: true }
    );
    if (!fan) return res.status(404).json({ message: 'Fan not found' });
    res.json({ message: 'Spotify access token saved', fan });
  } catch (error) {
    console.error('Save Spotify Token Error:', error);
    res.status(500).json({ message: error.message });
  }
}



// Create a new fan
const createFan = async (req, res) => {
  try {
    const fan = new Fan(req.body);
    await fan.save();
    res.status(201).json(fan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all fans
const getFans = async (req, res) => {
  try {
    const fans = await Fan.find();
    res.status(200).json(fans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single fan by ID
const getFanById = async (req, res) => {
  try {
    const fan = await Fan.findById(req.params.id);
    if (!fan) return res.status(404).json({ message: 'Fan not found' });
    res.status(200).json(fan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a fan by ID
const updateFan = async (req, res) => {
  try {
    const fan = await Fan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!fan) return res.status(404).json({ message: 'Fan not found' });
    res.status(200).json(fan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a fan by ID
const deleteFan = async (req, res) => {
  try {
    const fan = await Fan.findByIdAndDelete(req.params.id);
    if (!fan) return res.status(404).json({ message: 'Fan not found' });
    res.status(200).json({ message: 'Fan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  joinQueue,
  getAllSpotifyArtistStats,
  saveSpotifyAccessToken,
  createFan,
  getFans,
  getFanById,
  updateFan,
  deleteFan,
  calculateArtistPriority
};