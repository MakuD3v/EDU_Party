import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrawlButton from './BrawlButton';

const MainMenu = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem('username') || 'Player');
    const [joinCode, setJoinCode] = useState('');

    const handleQuickJoin = () => {
        if (joinCode.length === 4) {
            localStorage.setItem('currentLobby', joinCode.toUpperCase());
            localStorage.setItem('isHost', 'false');
            navigate(`/lobby/${joinCode.toUpperCase()}`);
        } else {
            alert('Please enter a 4-character code');
        }
    };

    return (
        <div className="relative min-h-screen w-screen overflow-hidden p-4 md:p-0">
            {/* Profile Widget - Top Left - Mobile Optimized */}
            <div className="absolute top-2 left-2 md:top-6 md:left-6 bg-white/90 rounded-xl md:rounded-2xl p-2 md:p-4 shadow-cartoony border-2 md:border-4 border-cartoony-dark flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-cartoony-blue rounded-full border-2 md:border-4 border-white flex items-center justify-center text-xl md:text-3xl">
                    😀
                </div>
                <div className="hidden md:block">
                    <p className="font-display font-bold text-cartoony-dark text-base md:text-lg">{username}</p>
                    <p className="text-xs md:text-sm text-gray-600">Level 1</p>
                </div>
            </div>

            {/* Center content - Mobile First */}
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <h1 className="font-display font-bold text-white text-4xl md:text-8xl mb-6 md:mb-12 drop-shadow-lg text-center">
                    EDU PARTY
                </h1>

                {/* Quick Join Input - Mobile Friendly */}
                <div className="w-full max-w-sm mb-6 md:mb-8">
                    <p className="text-white text-center mb-2 text-sm md:text-base">Quick Join:</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            maxLength={4}
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            className="font-display font-bold text-2xl md:text-4xl text-center bg-white/90 border-2 md:border-4 border-cartoony-dark rounded-xl md:rounded-2xl py-2 md:py-3 px-4 flex-1 tracking-widest"
                            placeholder="CODE"
                        />
                        <BrawlButton size="md" variant="blue" onClick={handleQuickJoin}>
                            GO
                        </BrawlButton>
                    </div>
                </div>

                {/* Action Buttons - Stack on Mobile */}
                <div className="flex flex-col w-full max-w-sm gap-3 md:gap-6">
                    <BrawlButton size="md" className="w-full" onClick={() => navigate('/host')}>
                        HOST GAME
                    </BrawlButton>
                    <BrawlButton size="md" className="w-full" variant="green" onClick={() => navigate('/lobbies')}>
                        BROWSE LOBBIES
                    </BrawlButton>
                </div>
            </div>

            {/* Giant PLAY button - Hidden on Mobile, Bottom Right on Desktop */}
            <div className="hidden md:block absolute bottom-12 right-12">
                <BrawlButton size="xl" onClick={() => navigate('/lobbies')}>
                    ▶ PLAY
                </BrawlButton>
            </div>
        </div>
    );
};

export default MainMenu;
