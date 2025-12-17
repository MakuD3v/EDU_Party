import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSelector from './ProfileSelector';
import '../index.css';

const MainMenu = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(null);

    const refinedItems = [
        { label: 'HOST GAME', action: () => console.log('Host') },
        { label: 'LOBBY LIST', action: () => navigate('/lobbies') },
        { label: 'PROFILE MENU', action: () => navigate('/profile') },
        { label: 'OPTIONS', action: () => console.log('Options') },
        { label: 'QUIT', action: () => { window.location.href = 'about:blank'; } },
    ];

    return (
        <div className="flex flex-col items-end justify-center h-full pr-[10%] box-border relative">
            <div className="absolute top-8 right-8">
                <ProfileSelector />
            </div>

            <div className="flex flex-col gap-3 w-80">
                {refinedItems.map((item, index) => (
                    <button
                        key={index}
                        className={`
                text-left font-title text-xl py-2 px-5 transition-all duration-300 relative
                ${activeItem === index
                                ? 'text-rk-text-white text-shadow-glow bg-gradient-to-r from-rk-teal-bright/10 to-transparent border-l-4 border-rk-teal-bright pl-8 skew-x-[-10deg]'
                                : 'text-rk-text-dim hover:text-rk-text-white hover:text-shadow-glow'
                            }
            `}
                        style={{ transform: activeItem === index ? 'translate(10px, 0)' : 'none' }}
                        onMouseEnter={() => setActiveItem(index)}
                        onClick={item.action}
                    >
                        {/* Counter-skew texts so they remain upright if we skew the button container? 
                Actually image shows text is normal. The highlight bar is slanted.
                The skew on the button effectively slants the border. Text might skew too.
                Let's use a pseudo-element for the precise shape if skew skews text.
                For now, skewing the whole button is a simple approximation. 
            */}
                        <span className={activeItem === index ? 'skew-x-[10deg] inline-block' : ''}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MainMenu;
