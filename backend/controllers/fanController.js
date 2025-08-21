import Fan from '../models/fanModel.js';
import SpotifyService from '../services/spotifyService.js';

// Create a new fan
export const createFan = async (req, res) => {
  try {
    const fan = new Fan(req.body);
    await fan.save();
    res.status(201).json(fan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all fans
export const getFans = async (req, res) => {
  try {
    const fans = await Fan.find();
    res.status(200).json(fans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single fan by ID
export const getFanById = async (req, res) => {
  try {
    const fan = await Fan.findById(req.params.id);
    if (!fan) return res.status(404).json({ message: 'Fan not found' });
    res.status(200).json(fan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a fan by ID
export const updateFan = async (req, res) => {
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
export const deleteFan = async (req, res) => {
  try {
    const fan = await Fan.findByIdAndDelete(req.params.id);
    if (!fan) return res.status(404).json({ message: 'Fan not found' });
    res.status(200).json({ message: 'Fan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate priority score using Spotify listening data
export const calculatePriorityScore = async (req, res) => {
  try {
    const fan = await Fan.findById(req.params.id);
    const { eventId, artistId } = req.body;

    if (!fan) {
      return res.status(404).json({ message: 'Fan not found' });
    }

    if (!fan.spotifyAccessToken) {
      return res.status(400).json({ message: 'No Spotify access token found. Please connect Spotify first.' });
    }

    let accessToken = fan.spotifyAccessToken;

    try {
      // Calculate priority score using absolute listening data
      let result = await SpotifyService.calculateAbsoluteListeningScore(accessToken, artistId);
      
      // If no recent data found, use fallback method
      if (result.priorityScore === 0) {
        result = await SpotifyService.calculateFallbackPriority(accessToken, artistId);
      }
      
      // Update or add queue position with priority score
      const existingQueueIndex = fan.priorityQueue.findIndex(
        q => q.eventId.toString() === eventId
      );

      if (existingQueueIndex !== -1) {
        fan.priorityQueue[existingQueueIndex].priorityScore = result.priorityScore;
      } else {
        fan.priorityQueue.push({
          eventId,
          position: 0, // Will be calculated based on priority ranking
          priorityScore: result.priorityScore,
          joinedAt: new Date()
        });
      }

      // Update fan's total listening time if we have metrics
      if (result.metrics && result.metrics.totalListeningTime) {
        fan.listeningTime = result.metrics.totalListeningTime;
      }

      await fan.save();

      res.json({
        message: result.fallback ? 
          'Priority calculated using fallback method (top artists ranking)' : 
          'Priority calculated from recent listening data',
        priorityScore: result.priorityScore,
        metrics: result.metrics || null,
        fallback: result.fallback || false,
        fanId: fan._id,
        explanation: result.metrics ? {
          playsContribution: Math.min(result.metrics.totalPlays * 2, 80),
          timeContribution: Math.min(result.metrics.totalListeningHours * 10, 60),
          frequencyContribution: Math.min(result.metrics.playFrequency * 5, 40),
          engagementContribution: Math.round(result.metrics.completionRate * 20)
        } : null
      });

    } catch (spotifyError) {
      // Handle token expiration
      if (spotifyError.message === 'EXPIRED_TOKEN' && fan.spotifyRefreshToken) {
        try {
          const newAccessToken = await SpotifyService.refreshAccessToken(fan.spotifyRefreshToken);
          fan.spotifyAccessToken = newAccessToken;
          await fan.save();
          
          return res.json({ 
            message: 'Access token refreshed. Please try calculating priority again.',
            tokenRefreshed: true 
          });
        } catch (refreshError) {
          return res.status(401).json({ 
            message: 'Failed to refresh Spotify token. Please re-authenticate with Spotify.',
            needsReauth: true 
          });
        }
      }
      
      console.error('Spotify API error:', spotifyError);
      res.status(500).json({ message: 'Failed to fetch Spotify data', error: spotifyError.message });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get priority queue for an event (sorted by priority score)
export const getEventPriorityQueue = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find all fans in queue for this event
    const fansInQueue = await Fan.find({
      'priorityQueue.eventId': eventId
    }).select('name email priorityQueue spotifyAccessToken');

    if (fansInQueue.length === 0) {
      return res.json({
        eventId,
        totalInQueue: 0,
        queue: []
      });
    }

    // Extract and sort by priority score (highest first)
    let queueData = fansInQueue.map(fan => {
      const queuePosition = fan.priorityQueue.find(
        q => q.eventId.toString() === eventId
      );
      
      return {
        fanId: fan._id,
        fanName: fan.name,
        fanEmail: fan.email,
        priorityScore: queuePosition.priorityScore || 0,
        joinedAt: queuePosition.joinedAt,
        hasSpotifyToken: !!fan.spotifyAccessToken
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);

    // Assign positions based on priority ranking
    queueData.forEach((fan, index) => {
      fan.position = index + 1;
    });

    res.json({
      eventId,
      totalInQueue: queueData.length,
      queue: queueData,
      lastUpdated: new Date()
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get fan's Spotify insights for a specific artist
export const getSpotifyInsights = async (req, res) => {
  try {
    const fan = await Fan.findById(req.params.id);
    const { artistId } = req.params;

    if (!fan) {
      return res.status(404).json({ message: 'Fan not found' });
    }

    if (!fan.spotifyAccessToken) {
      return res.status(400).json({ message: 'No Spotify access token found' });
    }

    try {
      const result = await SpotifyService.calculateAbsoluteListeningScore(fan.spotifyAccessToken, artistId);
      
      res.json({
        fanId: fan._id,
        artistId,
        insights: result.metrics,
        priorityScore: result.priorityScore,
        timestamp: new Date()
      });

    } catch (spotifyError) {
      if (spotifyError.message === 'EXPIRED_TOKEN') {
        return res.status(401).json({ 
          message: 'Spotify token expired. Please refresh token first.',
          needsRefresh: true 
        });
      }
      
      throw spotifyError;
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update fan's Spotify tokens
export const updateSpotifyTokens = async (req, res) => {
  try {
    const fan = await Fan.findById(req.params.id);
    const { spotifyAccessToken, spotifyRefreshToken, spotifyId } = req.body;

    if (!fan) {
      return res.status(404).json({ message: 'Fan not found' });
    }

    if (spotifyAccessToken) fan.spotifyAccessToken = spotifyAccessToken;
    if (spotifyRefreshToken) fan.spotifyRefreshToken = spotifyRefreshToken;
    if (spotifyId) fan.spotifyId = spotifyId;

    await fan.save();

    res.json({
      message: 'Spotify tokens updated successfully',
      hasAccessToken: !!fan.spotifyAccessToken,
      hasRefreshToken: !!fan.spotifyRefreshToken
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};