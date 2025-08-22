

import React, { useState } from 'react';
import './EventCard.css';
import { hasJoinedQueue } from '../../utils/hasJoinedQueue';
import supabase from '../../supabaseClient';


const EventCard = ({ event, joinedEventIds = [], onJoinQueue }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);

  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(hasJoinedQueue(event.id, joinedEventIds));
  const [queueInfo, setQueueInfo] = useState(null);
  const [insights, setInsights] = useState(null);
  const [user, setUser] = useState(null);
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        redirectTo: window.location.origin + '/spotify-test'
      }
    });
  };

  const handleJoinQueue = async () => {
    setJoining(true);
    try {
      const fanId = user.id;
      const artistId = event.artistId || event.artist; // Use real artistId if available
      const eventId = event.id;
      // Join queue
      const res = await fetch(`http://localhost:5000/api/fans/${encodeURIComponent(fanId)}/priority`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, artistId }),
      });
      if (res.ok) {
        setJoined(true);
        if (onJoinQueue) onJoinQueue(eventId);
        // Fetch queue info
        fetchQueueInfo(eventId, fanId);
        // Fetch listening stats
        fetchSpotifyInsights(fanId, artistId);
      }
    } catch (e) {
      // Optionally handle error
    } finally {
      setJoining(false);
    }
  };

  // Fetch queue info for this event and user
  const fetchQueueInfo = async (eventId, fanId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/fans/event/${eventId}/queue`);
      if (res.ok) {
        const data = await res.json();
        // Find this user's position
        const me = data.queue.find(q => q.fanId === fanId);
        setQueueInfo(me ? { position: me.position, priorityScore: me.priorityScore } : null);
      }
    } catch {}
  };

  // Fetch listening stats for this user and artist
  const fetchSpotifyInsights = async (fanId, artistId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/fans/${encodeURIComponent(fanId)}/spotify/${artistId}`);
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights);
      }
    } catch {}
  };

  // If already joined, fetch queue info and stats on mount
  React.useEffect(() => {
    if (joined && user) {
      const fanId = user.id;
      const artistId = event.artistId || event.artist;
      fetchQueueInfo(event.id, fanId);
      fetchSpotifyInsights(fanId, artistId);
    }
    // eslint-disable-next-line
  }, [joined, user]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextSong = () => {
    setCurrentSong((prev) => (prev + 1) % event.songs.length);
  };

  const handlePrevSong = () => {
    setCurrentSong((prev) => (prev - 1 + event.songs.length) % event.songs.length);
  };

  return (
    <div className="event-card">
      <div className="event-image-container">
        <img src={event.image} alt={event.artist} className="event-image" />
        <div className="play-overlay">
          <button className="play-button" onClick={handlePlayPause}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>
      
      <div className="event-info">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-artist">{event.artist}</p>
        <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
        <p className="event-venue">{event.venue}</p>
        
        <div className="event-details">
          <div className="price-info">
            <span className="price">{event.price}</span>
            <span className="available">{event.available} tickets left</span>
          </div>
        </div>

        {isPlaying && (
          <div className="music-player">
            <div className="now-playing">
              <span className="song-title">{event.songs[currentSong]}</span>
            </div>
            <div className="player-controls">
              <button onClick={handlePrevSong}>⏮️</button>
              <button onClick={handlePlayPause}>
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button onClick={handleNextSong}>⏭️</button>
            </div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        )}

        {!user && (
          <button className="buy-ticket-btn" onClick={handleLogin}>
            Login with Spotify to Join Queue
          </button>
        )}
        {user && !joined && (
          <button className="buy-ticket-btn" onClick={handleJoinQueue} disabled={joining}>
            {joining ? 'Joining...' : 'Join Queue'}
          </button>
        )}
        {joined && (
          <div className="queue-joined-msg">
            <div>You are in the queue!</div>
            {queueInfo && (
              <div style={{ marginTop: 8 }}>
                <strong>Queue Position:</strong> {queueInfo.position}<br />
                <strong>Priority Score:</strong> {queueInfo.priorityScore}
              </div>
            )}
            {insights && (
              <div style={{ marginTop: 8, fontSize: '0.95em', color: '#b8c1ec' }}>
                <div><strong>Listening Time:</strong> {insights.totalListeningHours} hours</div>
                <div><strong>Total Plays:</strong> {insights.totalPlays}</div>
                <div><strong>Unique Tracks:</strong> {insights.uniqueTracks}</div>
                <div><strong>Play Frequency:</strong> {insights.playFrequency} /day</div>
                <div><strong>Completion Rate:</strong> {Math.round(insights.completionRate * 100)}%</div>
              </div>
            )}
          </div>
        )}
        <button className="buy-ticket-btn">Get Tickets</button>
      </div>
    </div>
  );
};

export default EventCard;