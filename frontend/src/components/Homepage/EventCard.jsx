import React, { useState } from 'react';
import './EventCard.css';

const EventCard = ({ event }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);

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

        <button className="buy-ticket-btn">Get Tickets</button>
      </div>
    </div>
  );
};

export default EventCard;