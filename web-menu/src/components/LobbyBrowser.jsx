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
        <div className="relative min-h-screen w-screen overflow-y-auto p-4 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <button
                        className="text-white hover:text-yellow-300 font-display text-base md:text-xl"
                        onClick={() => navigate('/')}
                    >
                        ← BACK
                    </button>
                    <BrawlButton size="sm" onClick={fetchLobbies}>REFRESH</BrawlButton>
                </div>

                <h1 className="font-display font-bold text-white text-4xl md:text-7xl mb-8 md:mb-12 text-center drop-shadow-lg">
                    PUBLIC LOBBIES
                </h1>

                {loading ? (
                    <p className="text-white text-2xl md:text-3xl text-center">Loading...</p>
                ) : lobbies.length === 0 ? (
                    <div className="text-center">
                        <p className="text-white text-xl md:text-3xl mb-6 md:mb-8">No lobbies available</p>
                        <BrawlButton size="md" onClick={() => navigate('/host')}>
                            CREATE ONE
                        </BrawlButton>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {lobbies.map((lobby, i) => (
                            <div key={i} className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-cartoony-lg border-2 md:border-4 border-cartoony-dark">
                                <div className="flex justify-between items-start mb-3 md:mb-4">
                                    <div className="flex-1">
                                        <p className="font-display font-bold text-lg md:text-2xl text-cartoony-dark line-clamp-1">
                                            {lobby.lobby_name}
                                        </p>
                                        <p className="text-xs md:text-sm text-gray-600">by {lobby.host_username}</p>
                                        <p className="text-sm md:text-base text-cartoony-blue font-bold mt-1">
                                            {lobby.players.length}/{lobby.max_players} Players
                                        </p>
                                    </div>
                                    <div className="bg-cartoony-yellow rounded-lg py-1 px-2 md:px-3 border-2 border-yellow-600 flex-shrink-0">
                                        <p className="font-display font-bold text-sm md:text-lg">{lobby.loaded_game}</p>
                                    </div>
                                </div>

                                <div className="mb-3 md:mb-4 max-h-20 md:max-h-24 overflow-y-auto">
                                    {lobby.players.map((player, j) => (
                                        <div key={j} className="flex items-center gap-2 mb-1">
                                            <span className="text-base md:text-xl">😀</span>
                                            <span className="text-xs md:text-sm text-gray-700 truncate">{player}</span>
                                        </div>
                                    ))}
                                </div>

                                <BrawlButton
                                    variant="blue"
                                    size="sm"
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
