import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BrawlButton from './BrawlButton';

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
        const interval = setInterval(fetchLobbies, 3000);
        return () => clearInterval(interval);
    }, []);

    const joinLobby = (code) => {
        localStorage.setItem('currentLobby', code);
        localStorage.setItem('isHost', 'false');
        navigate(`/lobby/${code}`);
    };

    return (
        <div className="relative h-screen w-screen overflow-y-auto p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <button
                        className="text-white hover:text-yellow-300 font-display text-xl"
                        onClick={() => navigate('/')}
                    >
                        ← BACK
                    </button>
                    <BrawlButton onClick={fetchLobbies}>REFRESH</BrawlButton>
                </div>

                <h1 className="font-display font-bold text-white text-7xl mb-12 text-center drop-shadow-lg">
                    PUBLIC LOBBIES
                </h1>

                {loading ? (
                    <p className="text-white text-3xl text-center">Loading...</p>
                ) : lobbies.length === 0 ? (
                    <div className="text-center">
                        <p className="text-white text-3xl mb-8">No lobbies available</p>
                        <BrawlButton size="lg" onClick={() => navigate('/host')}>
                            CREATE ONE
                        </BrawlButton>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lobbies.map((lobby, i) => (
                            <div key={i} className="bg-white rounded-3xl p-6 shadow-cartoony-lg border-4 border-cartoony-dark">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="font-display font-bold text-2xl text-cartoony-dark">
                                            {lobby.host_username}'s Game
                                        </p>
                                        <p className="text-gray-600">Players: {lobby.players.length}</p>
                                    </div>
                                    <div className="bg-cartoony-yellow rounded-lg py-1 px-3 border-2 border-yellow-600">
                                        <p className="font-display font-bold text-lg">{lobby.loaded_game}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    {lobby.players.map((player, j) => (
                                        <div key={j} className="flex items-center gap-2 mb-2">
                                            <span className="text-xl">😀</span>
                                            <span className="text-gray-700">{player}</span>
                                        </div>
                                    ))}
                                </div>

                                <BrawlButton
                                    variant="blue"
                                    size="md"
                                    className="w-full"
                                    onClick={() => joinLobby(lobby.loaded_game)}
                                >
                                    JOIN
                                </BrawlButton>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LobbyBrowser;
