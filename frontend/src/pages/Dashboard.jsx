import React, { useState, useEffect } from 'react';
import api from '../api/api';
import PropertyCard from '../components/PropertyCard';

const Dashboard = () => {
  const [properties, setProperties] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [filters, setFilters] = useState({ city: '', minRent: '', maxRent: '', title: '' });\n  const [interestedProperties, setInterestedProperties] = useState({}); // To mock/store state if they already interested

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.minRent) queryParams.append('minRent', filters.minRent);
      if (filters.maxRent) queryParams.append('maxRent', filters.maxRent);

      const response = await api.get(`/properties?${queryParams.toString()}`);
      setProperties(response.data.properties);

      // Also fetch user's interests so we know what they already clicked
      const interestsRes = await api.get('/interests/me');
      const interestMap = {};
      interestsRes.data.forEach(int => {
        if(int.propertyId) {
            interestMap[int.propertyId._id] = int.status;
        }
      });
      setInterestedProperties(interestMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleInterest = async (propertyId, message) => {
    try {
      await api.post('/interests', { propertyId, message });
      setInterestedProperties(prev => ({ ...prev, [propertyId]: 'Pending' }));
      alert('Interest sent to owner successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending interest');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="page-title">Browse Properties</h1>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>\n          <input \n            type="text" \n            name="title" \n            placeholder="Property title..." \n            className="form-control" \n            style={{ width: '150px' }}\n            value={filters.title} \n            onChange={handleFilterChange} \n          />\n          <input \n            type="text" \n            name="city" \n            placeholder="City..." \n            className="form-control" \n            style={{ width: '120px' }}\n            value={filters.city} \n            onChange={handleFilterChange} \n          />\n          <input \n            type="number" \n            name="minRent" \n            placeholder="Min rent" \n            className="form-control" \n            style={{ width: '120px' }}\n            value={filters.minRent} \n            onChange={handleFilterChange} \n          />\n          <input \n            type="number" \n            name="maxRent" \n            placeholder="Max rent" \n            className="form-control" \n            style={{ width: '120px' }}\n            value={filters.maxRent} \n            onChange={handleFilterChange} \n          />\n          <button type="submit" className="btn btn-primary">Search</button>\n        </form>
      </div>

      {loading ? (
        <div>Loading properties...</div>
      ) : properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No properties found matching your criteria.
        </div>
      ) : (
        <div className="property-grid">
          {properties.map(property => (
            <PropertyCard 
              key={property._id} 
              property={property} 
              onInterest={handleInterest}
              interestStatus={interestedProperties[property._id]} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
