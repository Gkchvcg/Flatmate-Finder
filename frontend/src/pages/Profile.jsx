import React, { useState, useEffect } from 'react';
import api from '../api/api';

const Profile = () => {
    const [profile, setProfile] = useState({ name: '', phone: '', email: '', interests: [], hobbies: [] });
    const [myInterests, setMyInterests] = useState([]);
    const [receivedInterests, setReceivedInterests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ interests: '', hobbies: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [profileRes, sentRes, receivedRes] = await Promise.all([
                api.get('/users/me'),
                api.get('/interests/me'),
                api.get('/interests/received')
            ]);
            setProfile(profileRes.data);
            setEditForm({
                interests: profileRes.data.interests?.join(', ') || '',
                hobbies: profileRes.data.hobbies?.join(', ') || ''
            });
            setMyInterests(sentRes.data);
            setReceivedInterests(receivedRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveProfile = async () => {
        try {
            const interestsArray = editForm.interests.split(',').map(i => i.trim()).filter(i => i);
            const hobbiesArray = editForm.hobbies.split(',').map(i => i.trim()).filter(i => i);
            
            const res = await api.put('/users/me', {
                interests: interestsArray,
                hobbies: hobbiesArray
            });
            setProfile(res.data);
            setIsEditing(false);
        } catch (err) {
            alert('Failed to update profile');
        }
    };

    const handleUpdateStatus = async (interestId, status) => {
        try {
            await api.put(`/interests/${interestId}`, { status });
            // Refresh
            fetchData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div style={{padding: '2rem'}}>Loading profile...</div>;

    return (
        <div style={{ padding: '2rem 0' }}>
            <h1 className="page-title">My Profile</h1>
            
            <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <div>
                        <h3>{profile.name}</h3>
                        <p style={{color:'var(--text-muted)'}}>{profile.email} {profile.phone ? `| ${profile.phone}` : ''}</p>
                    </div>
                    {!isEditing && <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>}
                </div>

                {isEditing ? (
                    <div style={{marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
                        <div className="form-group">
                            <label>Interests (comma separated)</label>
                            <input type="text" className="form-control" value={editForm.interests} onChange={e => setEditForm({...editForm, interests: e.target.value})} placeholder="e.g. Reading, Traveling" />
                        </div>
                        <div className="form-group">
                            <label>Hobbies (comma separated)</label>
                            <input type="text" className="form-control" value={editForm.hobbies} onChange={e => setEditForm({...editForm, hobbies: e.target.value})} placeholder="e.g. Painting, Gaming" />
                        </div>
                        <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
                            <button className="btn btn-primary" onClick={handleSaveProfile}>Save</button>
                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div style={{marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
                        <p><strong>Interests:</strong> {profile.interests?.length > 0 ? profile.interests.join(', ') : 'Not specified'}</p>
                        <p><strong>Hobbies:</strong> {profile.hobbies?.length > 0 ? profile.hobbies.join(', ') : 'Not specified'}</p>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Received Interests */}
                <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{marginBottom: '1rem'}}>Interests Received on My Properties</h3>
                    {receivedInterests.length === 0 ? (
                        <p style={{color:'var(--text-muted)'}}>No interests received yet.</p>
                    ) : (
                        <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                            {receivedInterests.map(interest => (
                                <div key={interest._id} style={{border:'1px solid var(--border-color)', padding:'1rem', borderRadius:'0.5rem'}}>
                                    <p><strong>{interest.userId?.name}</strong> is interested in <strong>{interest.propertyId?.title}</strong></p>
                                    {interest.userId?.interests?.length > 0 && <p style={{fontSize:'0.875rem', marginTop:'0.25rem', color:'var(--text-color)'}}><strong>Interests:</strong> {interest.userId.interests.join(', ')}</p>}
                                    {interest.userId?.hobbies?.length > 0 && <p style={{fontSize:'0.875rem', marginTop:'0.25rem', color:'var(--text-color)'}}><strong>Hobbies:</strong> {interest.userId.hobbies.join(', ')}</p>}
                                    <p style={{fontSize:'0.875rem', color:'var(--text-muted)', margin:'0.5rem 0'}}>Status: <span style={{fontWeight:'bold'}}>{interest.status}</span></p>
                                    
                                    {interest.status === 'Pending' && (
                                        <div style={{display:'flex', gap:'0.5rem'}}>
                                            <button className="btn btn-primary" onClick={() => handleUpdateStatus(interest._id, 'Accepted')} style={{padding:'0.25rem 0.5rem', fontSize:'0.875rem'}}>Accept</button>
                                            <button className="btn btn-danger" onClick={() => handleUpdateStatus(interest._id, 'Rejected')} style={{padding:'0.25rem 0.5rem', fontSize:'0.875rem'}}>Reject</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sent Interests */}
                <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{marginBottom: '1rem'}}>Properties I Liked</h3>
                    {myInterests.length === 0 ? (
                        <p style={{color:'var(--text-muted)'}}>You haven't shown interest in any properties.</p>
                    ) : (
                        <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                            {myInterests.map(interest => (
                                <div key={interest._id} style={{border:'1px solid var(--border-color)', padding:'1rem', borderRadius:'0.5rem'}}>
                                    <h4>{interest.propertyId?.title}</h4>
                                    <p style={{fontSize:'0.875rem', color:'var(--text-muted)'}}>City: {interest.propertyId?.city}</p>
                                    <p style={{fontSize:'0.875rem', marginTop:'0.5rem'}}>
                                        Status: 
                                        <span style={{
                                            marginLeft:'4px',
                                            fontWeight:'bold',
                                            color: interest.status === 'Accepted' ? 'var(--success)' : 
                                                   interest.status === 'Rejected' ? 'var(--danger)' : 'var(--text-muted)'
                                        }}>
                                            {interest.status}
                                        </span>
                                    </p>
                                    {interest.status === 'Accepted' && (
                                        <p style={{fontSize:'0.875rem', marginTop:'0.5rem', color:'var(--success)'}}>Great! The owner will contact you shortly.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
