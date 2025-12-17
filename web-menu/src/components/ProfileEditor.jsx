import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileEditor = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem('username') || 'Guest');
    const [displayName, setDisplayName] = useState('');
    const [skin, setSkin] = useState('default');

    const API_URL = 'https://edu-party-server.onrender.com/api';

    useEffect(() => {
        if (username !== 'Guest') {
            axios.get(`${API_URL}/profile/${username}`)
                .then(res => {
                    setDisplayName(res.data.display_name || '');
                    setSkin(res.data.skin || 'default');
                })
                .catch(() => { });
        }
    }, [username]);

    const handleSave = async () => {
        try {
            await axios.post(`${API_URL}/profile`, {
                username,
                display_name: displayName,
                skin
            });
            localStorage.setItem('username', username);
            alert('Profile Saved!');
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Error saving profile');
        }
    };

    return (
        <div className="pt-24 px-12 h-screen flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <button
                    className="font-title text-rk-text-dim hover:text-rk-text-white mb-6 transition-colors"
                    onClick={() => navigate('/')}
                >
                    &lt; BACK
                </button>
                <h1 className="font-title text-5xl text-rk-text-white mb-8">Profile Settings</h1>

                <div className="bg-rk-bg-teal-deep/80 border border-rk-teal-muted rounded p-8 shadow-xl backdrop-blur-sm">
                    <div className="mb-6">
                        <label className="block text-rk-gold font-title mb-2">USERNAME (ID)</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-rk-bg-dark border border-rk-teal-muted text-rk-text-white p-3 focus:border-rk-teal-bright focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-rk-gold font-title mb-2">DISPLAY NAME</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full bg-rk-bg-dark border border-rk-teal-muted text-rk-text-white p-3 focus:border-rk-teal-bright focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-rk-gold font-title mb-2">SKIN</label>
                        <select
                            value={skin}
                            onChange={(e) => setSkin(e.target.value)}
                            className="w-full bg-rk-bg-dark border border-rk-teal-muted text-rk-text-white p-3 focus:border-rk-teal-bright focus:outline-none transition-colors appearance-none"
                        >
                            <option value="default">Default</option>
                            <option value="ruined">Ruined King</option>
                            <option value="sentinel">Sentinel</option>
                        </select>
                    </div>

                    <button
                        className="w-full bg-gradient-to-r from-rk-teal-muted to-rk-teal-bright/20 border border-rk-teal-bright text-rk-text-white font-title py-3 hover:brightness-110 transition-all text-shadow-glow"
                        onClick={handleSave}
                    >
                        SAVE CHANGES
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditor;
