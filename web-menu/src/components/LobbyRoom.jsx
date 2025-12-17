import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BrawlButton from './BrawlButton';

const LobbyRoom = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [lobby, setLobby] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isHost, setIsHost] = useState(false);
    const wsRef = useRef(null);

    const API_URL = 'https://edu-party-server.onrender.com/api';
    const WS_URL = 'wss://edu-party-server.onrender.com';
    const username = localStorage.getItem('username') || 'Player';

    useEffect(() => {
        setIsHost(localStorage.getItem('isHost') === 'true');
        fetchLobby();

        // Connect WebSocket for real-time updates
        connectWebSocket();

        // Fallback polling
        const interval = setInterval(fetchLobby, 2000);

        return () => {
            clearInterval(interval);
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [code]);

    const connectWebSocket = () => {
        try {
            wsRef.current = new WebSocket(`${WS_URL}/ws/game/${code}/${username}`);

            wsRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'GAME_START') {
                    // Show full-screen overlay and redirect
                    navigate('/game-instance');
                }
            };

            wsRef.current.onerror = (error) => {
                console.log('WebSocket error:', error);
            };
        } catch (err) {
            console.log('WebSocket connection failed, using polling');
        }
    };

    const fetchLobby = async () => {
        try {
            const res = await axios.get(`${API_URL}/lobbies`);
            const foundLobby = res.data.find(l => l.loaded_game === code);
            if (foundLobby) {
                setLobby(foundLobby);
                // Check if game started via polling
                if (foundLobby.status === 'PLAYING') {
                    navigate('/game-instance');
                }
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
                <p className="font-display text-2xl md:text-4xl text-white">Loading...</p>
            </div>
        );
    }

    if (!lobby) {
        return (
            <div className="h-screen w-screen flex items-center justify-center flex-col p-4">
                <p className="font-display text-2xl md:text-4xl text-white mb-6 md:mb-8 text-center">Lobby not found!</p>
                <BrawlButton size="md" onClick={() => navigate('/')}>BACK TO MENU</BrawlButton>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-screen flex items-center justify-center p-4">
            <div className="bg-white/95 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-cartoony-lg border-4 md:border-8 border-cartoony-dark w-full max-w-4xl">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <button
                        className="text-cartoony-blue hover:text-cartoony-blue-dark font-display text-sm md:text-base"
                        onClick={() => navigate('/')}
                    >
                        ← LEAVE
                    </button>
                    <div className="bg-cartoony-yellow rounded-lg md:rounded-xl py-1 md:py-2 px-3 md:px-6 border-2 md:border-4 border-yellow-600">
                        <p className="font-display font-bold text-base md:text-2xl text-cartoony-dark tracking-wider">
                            {code}
                        </p>
                    </div>
                </div>

                <h1 className="font-display font-bold text-3xl md:text-5xl text-cartoony-dark mb-1 md:mb-2 text-center">
                    {lobby.lobby_name}
                </h1>
                <p className="text-center text-sm md:text-base text-gray-600 mb-6 md:mb-8">
                    Host: {lobby.host_username}
                </p>

                <div className="mb-6 md:mb-8">
                    <h2 className="font-display font-bold text-xl md:text-2xl text-cartoony-dark mb-3 md:mb-4">
                        Players ({lobby.players.length}/{lobby.max_players}):
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {lobby.players.map((player, i) => (
                            <div key={i} className="bg-cartoony-blue rounded-xl p-3 md:p-4 border-2 md:border-4 border-blue-700 flex items-center gap-2 md:gap-3">
                                <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-lg md:text-2xl flex-shrink-0">
                                    😀
                                </div>
                                <p className="font-display font-bold text-white text-base md:text-xl truncate">{player}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {isHost && (
                    <div className="text-center">
                        <BrawlButton size="lg" className="w-full md:w-auto" variant="green" onClick={startGame}>
                            START GAME
                        </BrawlButton>
                    </div>
                )}

                {!isHost && (
                    <p className="text-center text-base md:text-xl text-gray-600 animate-pulse">
                        Waiting for host to start...
                    </p>
                )}
            </div>
        </div>
    );
};

export default LobbyRoom;
