import React, { useState, useEffect } from 'react';
import api from '../api/api';
import PropertyCard from '../components/PropertyCard';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', minRent: '', maxRent: '', title: '' });
  const [interestedProperties, setInterestedProperties] = useState({}); // To mock/store state if they already interested

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.title) queryParams.append('title', filters.title);
      if (filters.minRent) queryParams.append('minRent', filters.minRent);
      if (filters.maxRent) queryParams.append('maxRent', filters.maxRent);

      const response = await api.get(`/properties?${queryParams.toString()}`);
      setProperties(response.data.properties || []);

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="page-title">Browse Properties</h1>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="title"
            placeholder="Property title..."
            className="form-control"
            style={{ width: '150px' }}
            value={filters.title}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City..."
            className="form-control"
            style={{ width: '120px' }}
            value={filters.city}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="minRent"
            placeholder="Min rent"
            className="form-control"
            style={{ width: '120px' }}
            value={filters.minRent}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxRent"
            placeholder="Max rent"
            className="form-control"
            style={{ width: '120px' }}
            value={filters.maxRent}
            onChange={handleFilterChange}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {loading ? (
        <div>Loading properties...</div>
      ) : (properties || []).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No properties found matching your criteria.
        </div>
      ) : (
        <motion.div 
          className="property-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {properties.map((property) => (
            <motion.div
              key={property._id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <PropertyCard 
                property={property} 
                onInterest={handleInterest}
                interestStatus={interestedProperties[property._id]} 
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
