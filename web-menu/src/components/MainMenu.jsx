import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrawlButton from './BrawlButton';

const MainMenu = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem('username') || 'Player');

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            {/* Profile Widget - Top Left */}
            <div className="absolute top-6 left-6 bg-white/90 rounded-2xl p-4 shadow-cartoony-lg border-4 border-cartoony-dark flex items-center gap-3">
                <div className="w-16 h-16 bg-cartoony-blue rounded-full border-4 border-white flex items-center justify-center text-3xl">
                    😀
                </div>
                <div>
                    <p className="font-display font-bold text-cartoony-dark text-lg">{username}</p>
                    <p className="text-sm text-gray-600">Level 1</p>
                </div>
            </div>

            {/* center content */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <h1 className="font-display font-bold text-white text-8xl mb-12 drop-shadow-lg">
                    EDU PARTY
                </h1>

                <div className="flex flex-col gap-6">
                    <BrawlButton size="lg" onClick={() => navigate('/host')}>
                        HOST GAME
                    </BrawlButton>
                    <BrawlButton size="lg" variant="blue" onClick={() => navigate('/join')}>
                        JOIN GAME
                    </BrawlButton>
                    <BrawlButton size="lg" variant="green" onClick={() => navigate('/lobbies')}>
                        BROWSE LOBBIES
                    </BrawlButton>
                </div>
            </div>

            {/* Giant PLAY button - Bottom Right */}
            <div className="absolute bottom-12 right-12">
                <BrawlButton size="xl" onClick={() => navigate('/lobbies')}>
                    ▶ PLAY
                </BrawlButton>
            </div>
        </div>
    );
};

export default MainMenu;
