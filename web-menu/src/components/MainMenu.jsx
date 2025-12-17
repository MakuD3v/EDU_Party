import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSelector from './ProfileSelector';
import '../index.css';

const MainMenu = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(null);

    const menuItems = [
        { label: 'NEW GAME', action: () => navigate('/lobbies') }, // "Host Game" equivalent or Lobby List
        { label: 'LOAD GAME', action: () => console.log('Load') },
        { label: 'OPTIONS', action: () => navigate('/options') },
        { label: 'CREDITS', action: () => console.log('Credits') },
        { label: 'CHANGE PROFILE', action: () => navigate('/profile') }, // Explicit profile menu
        { label: 'QUIT GAME', action: () => window.close() }, // Works if running in an app wrapper
    ];

    // User request items: PROFILE MENU, LOBBY LIST, HOST GAME, OPTIONS, QUIT.
    // Mapping to visuals: 
    // "NEW GAME" -> Host/Lobby? 
    // Let's stick closer to the REQUEST list but style it like the IMAGE.
    // Image has: NEW GAME, LOAD, OPTIONS, CREDITS, CHANGE PROFILE, QUIT GAME.
    // Request: PROFILE MENU, LOBBY LIST, HOST GAME, OPTIONS, QUIT.

    // I will use Request Items but style them.
    const refinedItems = [
        { label: 'HOST GAME', action: () => console.log('Host') },
        { label: 'LOBBY LIST', action: () => navigate('/lobbies') },
        { label: 'PROFILE MENU', action: () => navigate('/profile') },
        { label: 'OPTIONS', action: () => console.log('Options') },
        { label: 'QUIT', action: () => { window.location.href = 'about:blank'; } },
    ];

    return (
        <div className="main-menu-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end', // Right side
            justifyContent: 'center',
            height: '100%',
            paddingRight: '10%',
            boxSizing: 'border-box'
        }}>
            <div style={{ position: 'absolute', top: 30, right: 30 }}>
                <ProfileSelector />
            </div>

            <div className="menu-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {refinedItems.map((item, index) => (
                    <button
                        key={index}
                        className={`rk-btn ${activeItem === index ? 'active' : ''}`}
                        onMouseEnter={() => setActiveItem(index)}
                        onClick={item.action}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MainMenu;
