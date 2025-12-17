import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LobbyBrowser = () => {
    const navigate = useNavigate();
    const [lobbies, setLobbies] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'https://edu-party-server.onrender.com/api';

    const fetchLobbies = async () => {
        try {
            const res = await axios.get(`${API_URL}/lobbies`);
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
        const username = localStorage.getItem('username') || 'Guest';
        const token = `${lobby.loaded_game}:${username}`;

        // Show launch instructions or trigger protocol
        // Since browsers might block protocols without interaction, we show a button or just do it.
        window.location.href = `eduparty://launch?token=${token}`;
    };

    const hostGame = async () => {
        const username = localStorage.getItem('username') || 'Guest';
        try {
            const res = await axios.post(`${API_URL}/lobbies/host?username=${username}`);
            const lobbyId = res.data.lobby_id;
            const token = `${lobbyId}:${username}`;
            window.location.href = `eduparty://launch?token=${token}`;
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="pt-24 px-12 h-screen flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <button
                    className="font-title text-rk-text-dim hover:text-rk-text-white mb-6 transition-colors"
                    onClick={() => navigate('/')}
                >
                    &lt; BACK
                </button>

                <h1 className="font-title text-5xl text-rk-text-white mb-8">Lobby Browser</h1>

                <div className="flex gap-4 mb-8">
                    <button
                        className="bg-rk-teal-muted/20 border border-rk-teal-bright text-rk-teal-bright font-title py-2 px-6 rounded hover:bg-rk-teal-bright hover:text-rk-bg-dark transition-all"
                        onClick={hostGame}
                    >
                        HOST NEW GAME
                    </button>
                    <button
                        className="text-rk-text-dim hover:text-rk-text-white font-title py-2 px-6"
                        onClick={fetchLobbies}
                    >
                        REFRESH
                    </button>
                </div>

                <div className="bg-rk-bg-teal-deep/80 border border-rk-teal-muted rounded p-6 shadow-xl backdrop-blur-sm">
                    {loading ? <p className="text-rk-text-dim">Loading...</p> : (
                        lobbies.length === 0 ? <p className="text-rk-text-dim">No active lobbies found.</p> :
                            lobbies.map((lobby, i) => (
                                <div key={i} className="flex justify-between items-center py-4 border-b border-rk-teal-muted last:border-0 hover:bg-white/5 transition-colors px-4 -mx-4">
                                    <div>
                                        <div className="font-title text-rk-gold text-lg">{lobby.host_username}'s Game</div>
                                        <div className="text-sm text-rk-text-dim">Players: {lobby.players.join(', ')}</div>
                                    </div>
                                    <button
                                        className="border border-rk-teal-bright text-rk-teal-bright font-title py-1 px-4 hover:bg-rk-teal-bright hover:text-rk-bg-dark transition-all"
                                        onClick={() => joinLobby(lobby)}
                                    >
                                        JOIN
                                    </button>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default LobbyBrowser;
