import React from 'react';
import { MapPin, Calendar, Heart } from 'lucide-react';

const PropertyCard = ({ property, onInterest, interestStatus }) => {
  return (
    <div className="property-card">
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
      
      <div className="property-footer">
        <span style={{fontSize:'0.875rem', color:'var(--text-muted)'}}>Posted by {property.creator?.name || 'User'}</span>
        {onInterest && (
          <button 
            className={`btn ${interestStatus ? 'btn-outline' : 'btn-primary'}`}
            style={{display:'flex', alignItems:'center', gap:'4px', padding:'0.25rem 0.75rem'}}
            onClick={() => onInterest(property._id)}
            disabled={!!interestStatus}
          >
            <Heart size={16} fill={interestStatus ? 'var(--primary-color)' : 'none'} />
            {interestStatus ? interestStatus : 'Interested'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
