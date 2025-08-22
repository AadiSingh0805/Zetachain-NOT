const axios = require('axios');

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

async function getAllArtistListeningStats(accessToken) {
  // Fetch up to 2000 recently played tracks (Spotify API limit: 50 per call)
  let allPlays = [];
  let next = null;
  let cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30);
  let keepFetching = true;
  let tries = 0;

  while (keepFetching && tries < 40) {
    const url = `${SPOTIFY_API_BASE}/me/player/recently-played?limit=50${next ? `&before=${next}` : ''}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const items = res.data.items || [];
    if (!items.length) break;
    allPlays.push(...items);
    const lastItemDate = new Date(items[items.length - 1].played_at);
    if (lastItemDate < cutoffDate) keepFetching = false;
    else next = new Date(items[items.length - 1].played_at).getTime();
    tries++;
    await new Promise(r => setTimeout(r, 100)); // rate limit
  }

  // Group by artist
  const artistStats = {};
  for (const play of allPlays) {
    const playedAt = new Date(play.played_at);
    if (playedAt < cutoffDate) continue;
    for (const artist of play.track.artists) {
      if (!artistStats[artist.id]) {
        artistStats[artist.id] = {
          artistId: artist.id,
          artistName: artist.name,
          totalListeningTime: 0,
          totalPlays: 0,
          uniqueTracks: new Set(),
        };
      }
      artistStats[artist.id].totalListeningTime += play.track.duration_ms;
      artistStats[artist.id].totalPlays += 1;
      artistStats[artist.id].uniqueTracks.add(play.track.id);
    }
  }

  // Convert to array and calculate hours, sort by listening time
  return Object.values(artistStats)
    .map(a => ({
      ...a,
      totalListeningHours: Math.round((a.totalListeningTime / (1000 * 60 * 60)) * 100) / 100,
      uniqueTracks: a.uniqueTracks.size,
    }))
    .sort((a, b) => b.totalListeningTime - a.totalListeningTime);
}
module.exports = { getAllArtistListeningStats };
