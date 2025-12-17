import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BrawlButton from './BrawlButton';

const LobbyRoom = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [lobby, setLobby] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isHost, setIsHost] = useState(false);

    const API_URL = 'https://edu-party-server.onrender.com/api';
    const username = localStorage.getItem('username') || 'Player';

    useEffect(() => {
        setIsHost(localStorage.getItem('isHost') === 'true');
        fetchLobby();
        const interval = setInterval(fetchLobby, 2000); // Poll every 2s
        return () => clearInterval(interval);
    }, [code]);

    const fetchLobby = async () => {
        try {
            const res = await axios.get(`${API_URL}/lobbies`);
            const foundLobby = res.data.find(l => l.loaded_game === code);
            if (foundLobby) {
                setLobby(foundLobby);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const startGame = async () => {
        try {
            await axios.post(`${API_URL}/lobbies/start?lobby_id=${code}`);
            // Redirect to game instance
            navigate('/game-instance');
        } catch (err) {
            console.error(err);
            alert('Failed to start game');
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <p className="font-display text-4xl text-white">Loading...</p>
            </div>
        );
    }

    if (!lobby) {
        return (
            <div className="h-screen w-screen flex items-center justify-center flex-col">
                <p className="font-display text-4xl text-white mb-8">Lobby not found!</p>
                <BrawlButton onClick={() => navigate('/')}>BACK TO MENU</BrawlButton>
            </div>
        );
    }

    return (
        <div className="relative h-screen w-screen flex items-center justify-center">
            <div className="bg-white/95 rounded-3xl p-12 shadow-cartoony-lg border-8 border-cartoony-dark max-w-4xl w-full">
                <div className="flex justify-between items-center mb-8">
                    <button
                        className="text-cartoony-blue hover:text-cartoony-blue-dark font-display"
                        onClick={() => navigate('/')}
                    >
                        ← LEAVE
                    </button>
                    <div className="bg-cartoony-yellow rounded-xl py-2 px-6 border-4 border-yellow-600">
                        <p className="font-display font-bold text-2xl text-cartoony-dark tracking-wider">
                            {code}
                        </p>
                    </div>
                </div>

                <h1 className="font-display font-bold text-5xl text-cartoony-dark mb-2 text-center">
                    LOBBY
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Host: {lobby.host_username}
                </p>

                <div className="mb-8">
                    <h2 className="font-display font-bold text-2xl text-cartoony-dark mb-4">
                        Players ({lobby.players.length}):
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {lobby.players.map((player, i) => (
                            <div key={i} className="bg-cartoony-blue rounded-xl p-4 border-4 border-blue-700 flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                                    😀
                                </div>
                                <p className="font-display font-bold text-white text-xl">{player}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {isHost && (
                    <div className="text-center">
                        <BrawlButton size="xl" variant="green" onClick={startGame}>
                            START GAME
                        </BrawlButton>
                    </div>
                )}

                {!isHost && (
                    <p className="text-center text-xl text-gray-600">Waiting for host to start...</p>
                )}
            </div>
        </div>
    );
};

export default LobbyRoom;
