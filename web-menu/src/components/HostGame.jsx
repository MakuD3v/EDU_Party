import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BrawlButton from './BrawlButton';

const HostGame = () => {
    const navigate = useNavigate();
    const [lobbyCode, setLobbyCode] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_URL = 'https://edu-party-server.onrender.com/api';

    const createLobby = async () => {
        const username = localStorage.getItem('username') || 'Player';
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/lobbies/host?username=${username}`);
            setLobbyCode(res.data.lobby_id);
            // Store code for the lobby room page
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
        <div className="relative h-screen w-screen flex items-center justify-center">
            <div className="bg-white/95 rounded-3xl p-12 shadow-cartoony-lg border-8 border-cartoony-dark max-w-2xl">
                <button
                    className="mb-6 text-cartoony-blue hover:text-cartoony-blue-dark font-display"
                    onClick={() => navigate('/')}
                >
                    ← BACK
                </button>

                <h1 className="font-display font-bold text-5xl text-cartoony-dark mb-8 text-center">
                    HOST A GAME
                </h1>

                {!lobbyCode ? (
                    <div className="text-center">
                        <p className="mb-6 text-xl text-gray-700">Ready to invite your friends?</p>
                        <BrawlButton size="lg" onClick={createLobby} className={loading ? 'opacity-50' : ''}>
                            {loading ? 'CREATING...' : 'CREATE LOBBY'}
                        </BrawlButton>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="mb-4 text-2xl text-gray-700">Your Lobby Code:</p>
                        <div className="bg-cartoony-yellow rounded-2xl py-8 px-12 mb-8 border-4 border-yellow-600 shadow-cartoony">
                            <p className="font-display font-bold text-7xl text-cartoony-dark tracking-widest">
                                {lobbyCode}
                            </p>
                        </div>
                        <p className="mb-6 text-gray-600">Share this code with your friends!</p>
                        <BrawlButton size="lg" variant="green" onClick={enterLobby}>
                            ENTER LOBBY
                        </BrawlButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HostGame;
