import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import ProfileEditor from './components/ProfileEditor';
import LobbyBrowser from './components/LobbyBrowser';
import './index.css';

function App() {
  return (
    <Router>
      <div className="bg-layer" style={{
        backgroundImage: "url('/background_placeholder.png')", /* Fallback if we have one or just gradient */
        background: "linear-gradient(to bottom, #2c3e50, #000000)" /* Temporary until image gen works or replaced */
      }}>
        {/* We can add a fog animation div here later */}
        <div className="fog-overlay"></div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/profile" element={<ProfileEditor />} />
          <Route path="/lobbies" element={<LobbyBrowser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
