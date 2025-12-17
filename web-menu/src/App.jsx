import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import HostGame from './components/HostGame';
import JoinGame from './components/JoinGame';
import LobbyRoom from './components/LobbyRoom';
import LobbyBrowser from './components/LobbyBrowser';
import GameInstance from './components/GameInstance';
import './index.css';

function App() {
  return (
    <Router>
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/host" element={<HostGame />} />
          <Route path="/join" element={<JoinGame />} />
          <Route path="/lobbies" element={<LobbyBrowser />} />
          <Route path="/lobby/:code" element={<LobbyRoom />} />
          <Route path="/game-instance" element={<GameInstance />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
