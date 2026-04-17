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
                hobbies: profileRes.data.hobbies?.join(', ') || '',
                gender: profileRes.data.gender || '',
                sleepSchedule: profileRes.data.sleepSchedule || '',
                smokingHabit: profileRes.data.smokingHabit || false,
                drinkingHabit: profileRes.data.drinkingHabit || false,
                cleanlinessLevel: profileRes.data.cleanlinessLevel || '',
                preferredArea: profileRes.data.preferredArea || '',
                budget: profileRes.data.preferences?.budget || ''
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
                hobbies: hobbiesArray,
                gender: editForm.gender,
                sleepSchedule: editForm.sleepSchedule,
                smokingHabit: editForm.smokingHabit,
                drinkingHabit: editForm.drinkingHabit,
                cleanlinessLevel: editForm.cleanlinessLevel,
                preferredArea: editForm.preferredArea,
                preferences: {
                    ...profile.preferences,
                    budget: editForm.budget ? Number(editForm.budget) : profile.preferences?.budget
                }
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div className="form-group">
                                <label>Gender</label>
                                <select className="form-control" value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Sleep Schedule</label>
                                <select className="form-control" value={editForm.sleepSchedule} onChange={e => setEditForm({...editForm, sleepSchedule: e.target.value})}>
                                    <option value="">Select Schedule</option>
                                    <option value="Early Bird">Early Bird</option>
                                    <option value="Night Owl">Night Owl</option>
                                    <option value="Flexible">Flexible</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Cleanliness Level</label>
                                <select className="form-control" value={editForm.cleanlinessLevel} onChange={e => setEditForm({...editForm, cleanlinessLevel: e.target.value})}>
                                    <option value="">Select Level</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Budget</label>
                                <input type="number" className="form-control" value={editForm.budget} onChange={e => setEditForm({...editForm, budget: e.target.value})} placeholder="Max budget" />
                            </div>
                        </div>
                        <div className="form-group" style={{marginTop:'1rem'}}>
                            <label>Preferred Area</label>
                            <input type="text" className="form-control" value={editForm.preferredArea} onChange={e => setEditForm({...editForm, preferredArea: e.target.value})} placeholder="e.g. Downtown, North Side" />
                        </div>
                        <div style={{display: 'flex', gap: '1.5rem', marginTop: '1rem'}}>
                            <label style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                                <input type="checkbox" checked={editForm.smokingHabit} onChange={e => setEditForm({...editForm, smokingHabit: e.target.checked})} />
                                I smoke
                            </label>
                            <label style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                                <input type="checkbox" checked={editForm.drinkingHabit} onChange={e => setEditForm({...editForm, drinkingHabit: e.target.checked})} />
                                I drink
                            </label>
                        </div>
                        <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
                            <button className="btn btn-primary" onClick={handleSaveProfile}>Save</button>
                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div style={{marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <p><strong>Interests:</strong> {profile.interests?.length > 0 ? profile.interests.join(', ') : 'Not specified'}</p>
                            <p><strong>Hobbies:</strong> {profile.hobbies?.length > 0 ? profile.hobbies.join(', ') : 'Not specified'}</p>
                            <p><strong>Gender:</strong> {profile.gender || 'Not specified'}</p>
                            <p><strong>Sleep:</strong> {profile.sleepSchedule || 'Not specified'}</p>
                            <p><strong>Cleanliness:</strong> {profile.cleanlinessLevel || 'Not specified'}</p>
                            <p><strong>Budget:</strong> {profile.preferences?.budget || 'Not specified'}</p>
                            <p><strong>Area:</strong> {profile.preferredArea || 'Not specified'}</p>
                            <p><strong>Habits:</strong> {[profile.smokingHabit ? 'Smoking' : '', profile.drinkingHabit ? 'Drinking' : ''].filter(Boolean).join(', ') || 'None'}</p>
                        </div>
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
                                <div key={interest._id} style={{border:'1px solid var(--border-color)', padding:'1rem', borderRadius:'0.5rem', position: 'relative'}}>
                                    <div className="checksum-badge" title="Compatibility Score">
                                        {interest.checksum}% Match
                                    </div>
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
