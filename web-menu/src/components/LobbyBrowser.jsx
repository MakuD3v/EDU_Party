import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

const LobbyBrowser = () => {
    const navigate = useNavigate();
    const [lobbies, setLobbies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLobbies = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/lobbies');
            setLobbies(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLobbies();
    }, []);

    const joinLobby = (lobby) => {
        // In real app, we might need a join endpoint.
        // For hand-off, we just launch the game with lobby ID.
        // Assuming current user is "Guest" or saved in localStorage.
        const username = localStorage.getItem('username') || 'Guest';
        // Construct token
        const token = `${lobby.loaded_game}:${username}`;
        window.location.href = `eduparty://launch?token=${token}`;
    };

    const hostGame = async () => {
        const username = localStorage.getItem('username') || 'Guest';
        try {
            const res = await axios.post(`http://localhost:8000/api/lobbies/host?username=${username}`);
            // Launch with token
            const lobbyId = res.data.lobby_id;
            const token = `${lobbyId}:${username}`;
            window.location.href = `eduparty://launch?token=${token}`;
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '50px', paddingTop: '100px' }}>
            <button className="rk-btn" onClick={() => navigate('/')}>&lt; BACK</button>
            <h1 className="rk-title" style={{ fontSize: '3rem', color: '#fff', marginTop: '20px' }}>Lobby Browser</h1>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <button className="rk-btn active" onClick={hostGame}>HOST NEW GAME</button>
                <button className="rk-btn" onClick={fetchLobbies}>REFRESH</button>
            </div>

            <div className="lobby-list" style={{
                background: 'rgba(11, 26, 38, 0.8)',
                padding: '20px',
                borderRadius: '5px',
                border: '1px solid var(--rk-teal-muted)',
                maxWidth: '800px'
            }}>
                {loading ? <p>Loading...</p> : (
                    lobbies.length === 0 ? <p style={{ color: 'var(--rk-text-dim)' }}>No active lobbies found.</p> :
                        lobbies.map((lobby, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '15px',
                                borderBottom: '1px solid var(--rk-teal-muted)',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ color: 'var(--rk-gold)', fontFamily: 'var(--font-title)' }}>{lobby.host_username}'s Game</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--rk-text-dim)' }}>Players: {lobby.players.join(', ')}</div>
                                </div>
                                <button className="rk-btn" style={{ fontSize: '1rem', border: '1px solid var(--rk-teal-bright)' }} onClick={() => joinLobby(lobby)}>
                                    JOIN
                                </button>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
};

export default LobbyBrowser;
