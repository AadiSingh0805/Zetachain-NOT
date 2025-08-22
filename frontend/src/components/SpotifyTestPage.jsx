import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

const SpotifyTestPage = () => {
  const [user, setUser] = useState(null);
  const [artistId, setArtistId] = useState('');
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allStats, setAllStats] = useState(null);
  const fetchAllStats = async () => {
    setLoading(true);
    setError('');
    setAllStats(null);
    if (!user) {
      setError('User required.');
      setLoading(false);
      return;
    }
    try {
      // Get the access token from Supabase session
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.provider_token;
      console.log('Spotify access token being sent:', accessToken);
      if (!accessToken) throw new Error('No Spotify access token found.');
      const res = await fetch(`http://localhost:5000/api/fans/${encodeURIComponent(user.id)}/spotify/insights/all?accessToken=${encodeURIComponent(accessToken)}`);
      if (!res.ok) throw new Error('Failed to fetch all artist stats');
      const data = await res.json();
      setAllStats(data.stats);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    setInsights(null);
    if (!user || !artistId) {
      setError('User and artist ID required.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/fans/${encodeURIComponent(user.id)}/spotify/${artistId}`);
      if (!res.ok) throw new Error('Failed to fetch insights');
      const data = await res.json();
      setInsights(data.insights);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: 24, background: '#232946', borderRadius: 12, color: '#fff' }}>
      <h2>Spotify Listening Insights (Test Page)</h2>
      {user ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <strong>Connected as:</strong> {user.email || user.id}
          </div>
          <input
            type="text"
            placeholder="Enter Spotify Artist ID"
            value={artistId}
            onChange={e => setArtistId(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 6, marginBottom: 12 }}
          />
          <button onClick={fetchInsights} style={{ padding: '8px 18px', borderRadius: 6, background: '#1db954', color: '#fff', fontWeight: 600, marginRight: 8 }} disabled={loading}>
            {loading ? 'Loading...' : 'Get Listening Insights'}
          </button>
          <button onClick={fetchAllStats} style={{ padding: '8px 18px', borderRadius: 6, background: '#1db954', color: '#fff', fontWeight: 600 }} disabled={loading}>
            {loading ? 'Loading...' : 'Get All Artist Stats'}
          </button>
          {allStats && (
            <div style={{ marginTop: 32 }}>
              <h3>All Artists Ranked by Listening Time (Last 30 Days)</h3>
              <table style={{ width: '100%', background: '#181c2b', borderRadius: 8, marginTop: 12, color: '#fff' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: 8 }}>Artist</th>
                    <th style={{ textAlign: 'right', padding: 8 }}>Hours</th>
                    <th style={{ textAlign: 'right', padding: 8 }}>Plays</th>
                    <th style={{ textAlign: 'right', padding: 8 }}>Unique Tracks</th>
                  </tr>
                </thead>
                <tbody>
                  {allStats.map((a, i) => (
                    <tr key={a.artistId} style={{ background: i % 2 ? '#22263a' : 'transparent' }}>
                      <td style={{ padding: 8 }}>{a.artistName}</td>
                      <td style={{ padding: 8, textAlign: 'right' }}>{a.totalListeningHours}</td>
                      <td style={{ padding: 8, textAlign: 'right' }}>{a.totalPlays}</td>
                      <td style={{ padding: 8, textAlign: 'right' }}>{a.uniqueTracks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {error && <div style={{ color: '#ff6b6b', marginTop: 12 }}>{error}</div>}
          {insights && (
            <div style={{ marginTop: 24, background: '#181c2b', padding: 16, borderRadius: 8 }}>
              <div><strong>Total Listening Hours:</strong> {insights.totalListeningHours}</div>
              <div><strong>Total Plays:</strong> {insights.totalPlays}</div>
              <div><strong>Unique Tracks:</strong> {insights.uniqueTracks}</div>
              <div><strong>Play Frequency:</strong> {insights.playFrequency} /day</div>
              <div><strong>Completion Rate:</strong> {Math.round(insights.completionRate * 100)}%</div>
            </div>
          )}
        </>
      ) : (
        <div>Please log in with Spotify to view your listening data.</div>
      )}
    </div>
  );
};

export default SpotifyTestPage;
