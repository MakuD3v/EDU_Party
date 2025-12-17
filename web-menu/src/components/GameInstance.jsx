import React from 'react';
import { useNavigate } from 'react-router-dom';
import BrawlButton from './BrawlButton';

const GameInstance = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="font-display font-bold text-white text-9xl mb-12 drop-shadow-lg animate-pulse">
                    YOU ARE NOW PLAYING!
                </h1>

                <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12 border-8 border-white/50">
                    <p className="text-white text-3xl mb-8">
                        🎮 Game in progress... 🎮
                    </p>
                    <BrawlButton size="lg" onClick={() => navigate('/')}>
                        BACK TO MENU
                    </BrawlButton>
                </div>
            </div>
        </div>
    );
};

export default GameInstance;
