import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BrawlButton from './BrawlButton';

const HostGame = () => {
    const navigate = useNavigate();
    const [lobbyCode, setLobbyCode] = useState(null);
    const [lobbyName, setLobbyName] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = 'https://edu-party-server.onrender.com/api';

    const createLobby = async () => {
        if (!lobbyName.trim()) {
            alert('Please enter a lobby name');
            return;
        }

        const username = localStorage.getItem('username') || 'Player';
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/lobbies/host?username=${username}&lobby_name=${encodeURIComponent(lobbyName)}`);
            setLobbyCode(res.data.lobby_id);
            localStorage.setItem('currentLobby', res.data.lobby_id);
            localStorage.setItem('isHost', 'true');
        } catch (err) {
            console.error(err);
            alert('Failed to create lobby');
        } finally {
            setLoading(false);
        }
    };

    const enterLobby = () => {
        navigate(`/lobby/${lobbyCode}`);
    };

    return (
        <div className="relative min-h-screen w-screen flex items-center justify-center p-4">
            <div className="bg-white/95 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-cartoony-lg border-4 md:border-8 border-cartoony-dark w-full max-w-2xl">
                <button
                    className="mb-4 md:mb-6 text-cartoony-blue hover:text-cartoony-blue-dark font-display text-sm md:text-base"
                    onClick={() => navigate('/')}
                >
                    ← BACK
                </button>

                <h1 className="font-display font-bold text-3xl md:text-5xl text-cartoony-dark mb-6 md:mb-8 text-center">
                    HOST A GAME
                </h1>

                {!lobbyCode ? (
                    <div className="text-center">
                        <p className="mb-4 md:mb-6 text-base md:text-xl text-gray-700">Name your lobby:</p>
                        <input
                            type="text"
                            value={lobbyName}
                            onChange={(e) => setLobbyName(e.target.value)}
                            placeholder="Maku's Math Party"
                            maxLength={30}
                            className="w-full font-display font-bold text-xl md:text-3xl text-center bg-gray-100 border-2 md:border-4 border-cartoony-dark rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 mb-6 md:mb-8"
                        />
                        <BrawlButton size="md" className="w-full md:w-auto" onClick={createLobby} disabled={loading}>
                            {loading ? 'CREATING...' : 'CREATE LOBBY'}
                        </BrawlButton>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="mb-2 md:mb-4 text-lg md:text-2xl text-gray-700">Your Lobby Code:</p>
                        <div className="bg-cartoony-yellow rounded-xl md:rounded-2xl py-4 md:py-8 px-6 md:px-12 mb-6 md:mb-8 border-2 md:border-4 border-yellow-600 shadow-cartoony">
                            <p className="font-display font-bold text-4xl md:text-7xl text-cartoony-dark tracking-widest">
                                {lobbyCode}
                            </p>
                        </div>
                        <p className="mb-4 md:mb-6 text-sm md:text-base text-gray-600">Share this code with your friends!</p>
                        <BrawlButton size="md" className="w-full md:w-auto" variant="green" onClick={enterLobby}>
                            ENTER LOBBY
                        </BrawlButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HostGame;
