import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    area: '',
    rent: '',
    deposit: '',
    amenities: '',
    availabilityDate: '',
    preferredGender: 'Any',
    preferredSleepSchedule: 'Any',
    preferredCleanliness: 'Any',
    smokingAllowed: true,
    drinkingAllowed: true,
    preferredOccupation: 'Any',
    images: []
  });
  const [imageUrl, setImageUrl] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (payload.amenities) {
        payload.amenities = payload.amenities.split(',').map(item => item.trim());
      }
      
      await api.post('/properties', payload);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', background: 'var(--card-bg)', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)' }}>
      <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>Add a New Property</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Property Title</label>
          <input type="text" name="title" className="form-control" required value={formData.title} onChange={handleChange} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" className="form-control" required value={formData.city} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Area / Neighborhood</label>
            <input type="text" name="area" className="form-control" value={formData.area} onChange={handleChange} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Rent (₹)</label>
            <input type="number" name="rent" className="form-control" required value={formData.rent} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Deposit (₹)</label>
            <input type="number" name="deposit" className="form-control" value={formData.deposit} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Date Available</label>
            <input type="date" name="availabilityDate" className="form-control" value={formData.availabilityDate} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Amenities (Comma separated)</label>
          <input type="text" name="amenities" className="form-control" placeholder="e.g. WiFi, AC, Gym" value={formData.amenities} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea style={{resize:'vertical', minHeight:'100px'}} name="description" className="form-control" required value={formData.description} onChange={handleChange} />
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Flatmate Preferences (Compatibility)</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>These options help us calculate the compatibility "Match %" for potential flatmates.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Preferred Gender</label>
              <select name="preferredGender" className="form-control" value={formData.preferredGender} onChange={handleChange}>
                <option value="Any">Any</option>
                <option value="Male">Male Only</option>
                <option value="Female">Female Only</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sleep Schedule</label>
              <select name="preferredSleepSchedule" className="form-control" value={formData.preferredSleepSchedule} onChange={handleChange}>
                <option value="Any">No Preference</option>
                <option value="Early Bird">Early Birds</option>
                <option value="Night Owl">Night Owls</option>
                <option value="Flexible">Flexible / No preference</option>
              </select>
            </div>
            <div className="form-group">
              <label>Cleanliness Preference</label>
              <select name="preferredCleanliness" className="form-control" value={formData.preferredCleanliness} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Any">Any</option>
              </select>
            </div>
            <div className="form-group">
              <label>Preferred Occupation</label>
              <select name="preferredOccupation" className="form-control" value={formData.preferredOccupation} onChange={handleChange}>
                <option value="Student">Student</option>
                <option value="Professional">Professional</option>
                <option value="Any">Any</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" name="smokingAllowed" checked={formData.smokingAllowed} onChange={handleChange} />
              Smoking Allowed
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" name="drinkingAllowed" checked={formData.drinkingAllowed} onChange={handleChange} />
              Drinking Allowed
            </label>
          </div>
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Room Photos</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Paste image URL here..." 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
            />
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={() => {
                if (imageUrl) {
                  setFormData({ ...formData, images: [...formData.images, imageUrl] });
                  setImageUrl('');
                }
              }}
            >
              Add
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {formData.images.map((img, index) => (
              <div key={index} style={{ position: 'relative', width: '80px', height: '80px' }}>
                <img src={img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.25rem' }} />
                <button 
                  type="button" 
                  style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
