import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import ProfileEditor from './components/ProfileEditor';
import LobbyBrowser from './components/LobbyBrowser';
import './index.css';

function App() {
  return (
    <Router>
      <div className="bg-layer fixed inset-0 -z-10 bg-cover bg-center" style={{
        background: "linear-gradient(to bottom, #2c3e50 0%, #050a10 100%)",
        backgroundImage: "radial-gradient(circle at 50% 0%, #c49b66 0%, #4a2c2c 20%, #1a2a36 60%, #050a10 100%)"
      }}>
        <div className="fog-overlay absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 pointer-events-none"></div>
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
