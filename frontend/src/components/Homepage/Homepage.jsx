import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MainContent from './MainContent';
import './Homepage.css';

const Homepage = () => {
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="homepage">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="main-section">
        <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <MainContent currentView={currentView} searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default Homepage;