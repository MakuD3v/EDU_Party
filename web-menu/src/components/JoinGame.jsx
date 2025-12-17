import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrawlButton from './BrawlButton';

const JoinGame = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');

    const joinLobby = () => {
        if (code.length === 4) {
            localStorage.setItem('currentLobby', code.toUpperCase());
            localStorage.setItem('isHost', 'false');
            navigate(`/lobby/${code.toUpperCase()}`);
        } else {
            alert('Please enter a 4-character lobby code');
        }
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
                    JOIN A GAME
                </h1>

                <div className="text-center">
                    <p className="mb-6 text-xl text-gray-700">Enter the Lobby Code:</p>

                    <input
                        type="text"
                        maxLength={4}
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        className="font-display font-bold text-6xl text-center bg-gray-100 border-4 border-cartoony-dark rounded-2xl py-6 px-12 mb-8 w-full tracking-widest"
                        placeholder="ABCD"
                    />

                    <BrawlButton size="lg" variant="blue" onClick={joinLobby}>
                        JOIN LOBBY
                    </BrawlButton>
                </div>
            </div>
        </div>
    );
};

export default JoinGame;
