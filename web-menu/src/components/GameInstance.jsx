import React from 'react';
import { useNavigate } from 'react-router-dom';
import BrawlButton from './BrawlButton';

const GameInstance = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-br from-cartoony-green to-cartoony-blue p-4">
            <div className="text-center">
                <h1 className="font-display font-bold text-white text-5xl md:text-9xl mb-8 md:mb-12 drop-shadow-lg animate-pulse leading-tight">
                    GAME STARTING!
                </h1>

                <h2 className="font-display font-bold text-white text-3xl md:text-6xl mb-6 md:mb-8 drop-shadow-lg">
                    YOU ARE NOW PLAYING!
                </h2>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-12 border-4 md:border-8 border-white/50">
                    <p className="text-white text-2xl md:text-3xl mb-6 md:mb-8">
                        🎮 Game in progress... 🎮
                    </p>
                    <BrawlButton size="md" className="w-full md:w-auto" onClick={() => navigate('/')}>
                        BACK TO MENU
                    </BrawlButton>
                </div>
            </div>
        </div>
    );
};

export default GameInstance;
