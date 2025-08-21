import axios from 'axios';

class SpotifyService {
  constructor() {
    this.baseURL = 'https://api.spotify.com/v1';
    this.authURL = 'https://accounts.spotify.com/api/token';
  }

  // Refresh access token using refresh token
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(this.authURL, 
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
          }
        }
      );
      
      return response.data.access_token;
    } catch (error) {
      console.error('Error refreshing Spotify token:', error);
      throw error;
    }
  }

  // Get recently played tracks with pagination
  async getRecentlyPlayed(accessToken, limit = 50, before = null) {
    try {
      const params = { limit };
      if (before) params.before = before;

      const response = await axios.get(`${this.baseURL}/me/player/recently-played`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        params
      });
      
      return response.data.items;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('EXPIRED_TOKEN');
      }
      throw error;
    }
  }

  // Get extensive recent history by paginating backwards
  async getExtensiveRecentHistory(accessToken, targetArtistId, daysBack = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    
    let allPlays = [];
    let before = null;
    let hasMoreData = true;
    
    // Get up to 40 pages (can collect 1000-2000 recent tracks)
    for (let page = 0; page < 40 && hasMoreData; page++) {
      try {
        const items = await this.getRecentlyPlayed(accessToken, 50, before);
        
        if (items.length === 0) break;
        
        // Filter by date and artist
        const recentItems = items.filter(item => {
          const playedAt = new Date(item.played_at);
          const isTargetArtist = item.track.artists.some(artist => artist.id === targetArtistId);
          return playedAt >= cutoffDate && isTargetArtist;
        });
        
        allPlays.push(...recentItems);
        
        // Check if we've gone beyond our date range
        const lastItemDate = new Date(items[items.length - 1].played_at);
        if (lastItemDate < cutoffDate) {
          hasMoreData = false;
        }
        
        before = lastItemDate.getTime();
        
        // Rate limiting - small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`Error fetching page ${page + 1}:`, error.message);
        break;
      }
    }
    
    return allPlays;
  }

  // Calculate track completion rate (indicates genuine listening vs skipping)
  calculateTrackCompletionRate(plays) {
    if (plays.length === 0) return 0;
    
    // Group consecutive plays of the same track
    const trackSessions = [];
    let currentSession = null;
    
    plays.forEach(play => {
      if (currentSession && currentSession.trackId === play.track.id) {
        // Same track played again quickly = likely skipped and restarted
        currentSession.plays.push(play);
      } else {
        if (currentSession) trackSessions.push(currentSession);
        currentSession = {
          trackId: play.track.id,
          duration: play.track.duration_ms,
          plays: [play]
        };
      }
    });
    
    if (currentSession) trackSessions.push(currentSession);
    
    // Single plays = likely completed, multiple rapid plays = likely skipped
    const completedSessions = trackSessions.filter(session => session.plays.length === 1);
    return completedSessions.length / trackSessions.length;
  }

  // Calculate absolute listening score based on recent plays
  async calculateAbsoluteListeningScore(accessToken, targetArtistId) {
    try {
      // Get last 30 days of plays for this specific artist
      const recentPlays = await this.getExtensiveRecentHistory(accessToken, targetArtistId, 30);
      
      if (recentPlays.length === 0) {
        return {
          priorityScore: 0,
          metrics: {
            totalPlays: 0,
            totalListeningTime: 0,
            totalListeningHours: 0,
            uniqueTracks: 0,
            playFrequency: 0,
            completionRate: 0
          }
        };
      }
      
      // Calculate concrete metrics
      const totalPlays = recentPlays.length;
      const totalListeningTime = recentPlays.reduce((sum, play) => sum + play.track.duration_ms, 0);
      const uniqueTracks = [...new Set(recentPlays.map(play => play.track.id))].length;
      const playFrequency = totalPlays / 30; // Plays per day over 30 days
      const completionRate = this.calculateTrackCompletionRate(recentPlays);
      
      // Calculate priority score based on absolute metrics
      let priorityScore = 0;
      
      // Raw play count (40% of score) - Most important metric
      priorityScore += Math.min(totalPlays * 2, 80); // 2 points per play, max 80 points
      
      // Listening time in hours (30% of score)
      const hoursListened = totalListeningTime / (1000 * 60 * 60);
      priorityScore += Math.min(hoursListened * 10, 60); // 10 points per hour, max 60 points
      
      // Play frequency (20% of score) - Shows consistency
      priorityScore += Math.min(playFrequency * 5, 40); // 5 points per daily play, max 40 points
      
      // Engagement quality (10% of score) - Are they actually listening?
      priorityScore += completionRate * 20; // Up to 20 points for high completion rate
      
      return {
        priorityScore: Math.round(priorityScore),
        metrics: {
          totalPlays,
          totalListeningTime,
          totalListeningHours: Math.round(hoursListened * 100) / 100,
          uniqueTracks,
          playFrequency: Math.round(playFrequency * 100) / 100,
          completionRate: Math.round(completionRate * 100) / 100
        }
      };
      
    } catch (error) {
      throw error;
    }
  }

  // Get user's top artists (fallback for users with limited recent history)
  async getTopArtists(accessToken, timeRange = 'medium_term', limit = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/me/top/artists`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        params: { time_range: timeRange, limit: limit }
      });
      
      return response.data.items;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('EXPIRED_TOKEN');
      }
      throw error;
    }
  }

  // Fallback calculation for users with minimal recent history
  async calculateFallbackPriority(accessToken, targetArtistId) {
    try {
      const topArtists = await this.getTopArtists(accessToken, 'medium_term', 50);
      const artistRank = topArtists.findIndex(a => a.id === targetArtistId);
      
      if (artistRank === -1) return { priorityScore: 0, fallback: true };
      
      // Simple ranking-based score for fallback
      const score = Math.max(50 - artistRank, 0);
      
      return {
        priorityScore: score,
        fallback: true,
        artistRank: artistRank + 1
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new SpotifyService();
