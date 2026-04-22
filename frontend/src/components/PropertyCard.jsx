import React from 'react';
import { MapPin, Calendar, Heart } from 'lucide-react';

const PropertyCard = ({ property, onInterest, interestStatus, onDelete }) => {
  const getMatchColor = (score) => {
    if (score >= 80) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // Green (Excellent)
    if (score >= 50) return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'; // Orange (Good)
    return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'; // Grey (Low)
  };

  return (
    <div className="property-card" style={{ position: 'relative' }}>
      <div className="property-image-container" style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
        <img 
          src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&q=80'} 
          alt={property.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        {property.matchScore !== undefined && (
          <div className="checksum-badge" style={{ background: getMatchColor(property.matchScore), position: 'absolute', top: '12px', left: '12px', margin: 0 }}>
            {property.matchScore}% Match
          </div>
        )}
      </div>
      <div className="property-card-body">
        <h3 className="property-title">{property.title}</h3>
        <p className="property-price">₹{property.rent} <span style={{fontSize:'0.875rem', color:'var(--text-muted)', fontWeight:'normal'}}>/ month</span></p>
        
        <div className="property-meta">
          <div style={{display:'flex', alignItems:'center', gap:'4px'}}><MapPin size={16}/> {property.city} {property.area ? `- ${property.area}` : ''}</div>
          <div style={{display:'flex', alignItems:'center', gap:'4px'}}><Calendar size={16}/> {new Date(property.availabilityDate).toLocaleDateString()}</div>
        </div>
        
        <div style={{marginBottom:'1rem'}}>
          {property.amenities && property.amenities.map((amenity, idx) => (
            <span key={idx} className="badge" style={{marginRight:'4px'}}>{amenity.trim()}</span>
          ))}
        </div>
        
        <p style={{color:'var(--text-muted)', fontSize:'0.875rem', marginBottom:'1rem'}}>
          {property.description.length > 100 ? `${property.description.substring(0, 100)}...` : property.description}
        </p>
      </div>
      
      <div className="property-footer" style={{ alignItems: 'flex-start' }}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{fontSize:'0.875rem', color:'var(--text-muted)'}}>Posted by {property.creator?.name || 'User'}</span>
          <span style={{fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.25rem'}}>Occupation: {property.creator?.occupation || 'N/A'}</span>
          {property.creator?.interests && property.creator.interests.length > 0 && (
            <span style={{fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.25rem'}}>Interests: {property.creator.interests.join(', ')}</span>
          )}
          {property.creator?.hobbies && property.creator.hobbies.length > 0 && (
            <span style={{fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.25rem'}}>Hobbies: {property.creator.hobbies.join(', ')}</span>
          )}
        </div>
        {onInterest && (
          <button 
            className={`btn ${interestStatus ? 'btn-outline' : 'btn-primary'}`}
            style={{display:'flex', alignItems:'center', gap:'4px', padding:'0.25rem 0.75rem', marginTop: property.creator?.interests?.length || property.creator?.hobbies?.length ? '0' : 'auto'}}
            onClick={() => {
              if (interestStatus) return;
              const msg = prompt('Add a short note to the owner (optional):', 'Hey, I am interested in this flatmate listing!');
              onInterest(property._id, msg);
            }}
            disabled={!!interestStatus}
          >
            <Heart size={16} fill={interestStatus ? 'var(--primary-color)' : 'none'} />
            {interestStatus ? interestStatus : 'Interested'}
          </button>
        )}
        {onDelete && (
          <button 
            className="btn btn-danger"
            style={{display:'flex', alignItems:'center', gap:'4px', padding:'0.25rem 0.75rem', marginTop: 'auto'}}
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this listing?')) {
                onDelete(property._id);
              }
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
