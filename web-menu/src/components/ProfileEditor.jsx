import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

const ProfileEditor = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem('username') || 'Guest');
    const [displayName, setDisplayName] = useState('');
    const [skin, setSkin] = useState('default');

    useEffect(() => {
        // Fetch existing
        if (username !== 'Guest') {
            axios.get(`http://localhost:8000/api/profile/${username}`)
                .then(res => {
                    setDisplayName(res.data.display_name || '');
                    setSkin(res.data.skin || 'default');
                })
                .catch(() => { });
        }
    }, [username]);

    const handleSave = async () => {
        // Save to backend
        try {
            await axios.post('http://localhost:8000/api/profile', {
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
        <div style={{ padding: '50px', paddingTop: '100px', maxWidth: '600px' }}>
            <button className="rk-btn" onClick={() => navigate('/')}>&lt; BACK</button>
            <h1 className="rk-title" style={{ fontSize: '3rem', color: '#fff', marginTop: '20px' }}>Profile Settings</h1>

            <div style={{ background: 'rgba(11, 26, 38, 0.8)', padding: '30px', borderRadius: '5px', border: '1px solid var(--rk-teal-muted)' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: 'var(--rk-gold)', marginBottom: '5px' }}>USERNAME (ID)</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            background: '#050a10',
                            border: '1px solid var(--rk-teal-muted)',
                            color: '#fff',
                            padding: '10px',
                            width: '100%'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: 'var(--rk-gold)', marginBottom: '5px' }}>DISPLAY NAME</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        style={{
                            background: '#050a10',
                            border: '1px solid var(--rk-teal-muted)',
                            color: '#fff',
                            padding: '10px',
                            width: '100%'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: 'var(--rk-gold)', marginBottom: '5px' }}>SKIN</label>
                    <select
                        value={skin}
                        onChange={(e) => setSkin(e.target.value)}
                        style={{
                            background: '#050a10',
                            border: '1px solid var(--rk-teal-muted)',
                            color: '#fff',
                            padding: '10px',
                            width: '100%'
                        }}
                    >
                        <option value="default">Default</option>
                        <option value="ruined">Ruined King</option>
                        <option value="sentinel">Sentinel</option>
                    </select>
                </div>

                <button className="rk-btn active" onClick={handleSave} style={{ width: '100%', textAlign: 'center' }}>SAVE CHANGES</button>
            </div>
        </div>
    );
};

export default ProfileEditor;
