import React from 'react';
import './Sidebar.css';

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'search', icon: '🔍', label: 'Search' },
    { id: 'browse', icon: '🎵', label: 'Browse Events' },
    { id: 'tickets', icon: '🎫', label: 'Your Tickets' },
    { id: 'playlist', icon: '💖', label: 'Liked Events' },
  ];

  const playlists = [
    'Recently Played',
    'Trending Now',
    'Rock Concerts',
    'Electronic Shows',
    'Jazz Nights'
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">ZetaBeats</h1>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-section">
        <h3 className="section-title">Your Library</h3>
        <ul className="playlist-list">
          {playlists.map((playlist, index) => (
            <li key={index}>
              <button className="playlist-item">
                <div className="playlist-icon">📁</div>
                <span className="playlist-name">{playlist}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <button className="create-playlist-btn">
          <span className="plus-icon">+</span>
          Create Playlist
        </button>
      </div>
    </div>
  );
};

export default Sidebar;