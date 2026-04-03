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
    availabilityDate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div style={{ maxWidth: '600px', margin: '2rem auto', background: 'var(--card-bg)', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
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

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
