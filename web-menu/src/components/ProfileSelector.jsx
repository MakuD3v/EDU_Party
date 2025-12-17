import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileSelector = () => {
    // Top right profile widget
    const [profile, setProfile] = useState({ display_name: 'Guest', skin: 'default' });

    useEffect(() => {
        // Fetch profile
    }, []);

    return (
        <div className="flex items-center gap-4">
            <div className="text-right">
                <div className="font-title text-xl text-rk-text-white">
                    {profile.display_name}
                </div>
                <div className="text-xs text-rk-text-dim">Level 1</div>
            </div>
            <div className="w-12 h-12 border-2 border-rk-gold rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                {/* Icon placeholder */}
                <span className="text-rk-gold text-2xl">♟</span>
            </div>
        </div>
    );
};

export default ProfileSelector;
