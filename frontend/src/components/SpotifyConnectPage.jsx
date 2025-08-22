import React, { useEffect, useState } from 'react';
import './SpotifyConnectPage.css';
import supabase from '../supabaseClient';

const SpotifyConnectPage = () => {


  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });
    // Set initial state
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user || null);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session && user) {
      // Spotify tokens are in session.provider_token and session.provider_refresh_token
      const accessToken = session.provider_token;
      const refreshToken = session.provider_refresh_token;
      const supabaseId = user.id;
      if (accessToken && supabaseId) {
        // Save tokens to backend for stats endpoints
        fetch('http://localhost:5000/api/fans/save-spotify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            supabaseId,
            spotifyAccessToken: accessToken
          }),
        })
          .then(res => res.json())
          .then(data => {
            // Optionally show success or update UI
          })
          .catch(err => {
            // Optionally handle error
          });
      }
    }
  }, [session, user]);

  const handleSpotifyLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        redirectTo: window.location.origin + '/spotify-test'
      }
    });
    setLoading(false);
  };

  return (
    <div className="spotify-connect-page">
      <div className="spotify-connect-card">
        <h2>Connect Your Spotify Account</h2>
        <p>
          Link your Spotify account to track your listening time and join event priority queues based on your fan activity!
        </p>
        {!user && (
          <button className="spotify-auth-btn" onClick={handleSpotifyLogin} disabled={loading}>
            {loading ? 'Connecting...' : 'Connect with Spotify'}
          </button>
        )}
        {user && (
          <div style={{ marginTop: '1.5rem', color: '#1db954' }}>
            <strong>Connected as:</strong> {user.email || user.id}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyConnectPage;
