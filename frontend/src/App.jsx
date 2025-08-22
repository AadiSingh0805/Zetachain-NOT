import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LandingPage from './components/LandingPage'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Homepage from './components/Homepage/Homepage'
import SpotifyConnectPage from './components/SpotifyConnectPage'
import SpotifyTestPage from './components/SpotifyTestPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/connect-spotify" element={<SpotifyConnectPage />} />
          <Route path="/spotify-test" element={<SpotifyTestPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
