import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileSelector = () => {
    // Top right profile widget
    const [profile, setProfile] = useState({ display_name: 'Guest', skin: 'default' });

    useEffect(() => {
        // Fetch profile
        // Placeholder for now
    }, []);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
                <div style={{
                    fontFamily: "var(--font-title)",
                    fontSize: '1.2rem',
                    color: 'var(--rk-text-white)'
                }}>
                    {profile.display_name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--rk-text-dim)' }}>Level 1</div>
            </div>
            <div style={{
                width: '50px',
                height: '50px',
                border: '2px solid var(--rk-gold)',
                borderRadius: '50%',
                backgroundColor: '#111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                {/* Icon placeholder */}
                <span style={{ color: 'var(--rk-gold)', fontSize: '24px' }}>♟</span>
            </div>
        </div>
    );
};

export default ProfileSelector;
