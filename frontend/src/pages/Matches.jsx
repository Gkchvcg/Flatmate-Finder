import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { MessageCircle, Home, User, Inbox } from 'lucide-react';

const Matches = () => {
  const { user } = useContext(AuthContext);
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPairs = async () => {
      try {
        const res = await api.get('/pairs/user');
        setPairs(res.data);
      } catch (err) {
        console.error('Error fetching matches', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPairs();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading matches...</div>
      </div>
    );
  }

  if (!pairs || pairs.length === 0) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '1rem', marginTop: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <Inbox size={48} style={{ color: 'var(--primary-color)', opacity: 0.5, marginBottom: '1rem' }} />
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>No matches yet</h2>
        <p style={{ color: 'var(--text-muted)' }}>Once you have mutual interest, a chat will appear here.</p>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Browse Properties</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 className="page-title" style={{ marginBottom: '2rem' }}>Your Matches</h1>
      
      <motion.div 
        className="matches-grid" 
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {pairs.map((pair, index) => {
          const u1Id = pair.user1._id || pair.user1;
          const currentUserId = user._id || user.id;
          
          const partner = u1Id.toString() === currentUserId.toString() ? pair.user2 : pair.user1;
          
          return (
            <motion.div 
              key={pair._id} 
              className="glass-card"
              style={{ 
                padding: '1.5rem', 
                borderRadius: '1rem', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1rem',
                border: '1px solid var(--border-color)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--primary-color), #7C3AED)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  {partner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>{partner.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    <Home size={14} />
                    <span>{pair.property?.title || 'Property'} • {pair.property?.city || 'City'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <Link to={`/chat/${pair._id}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
                  <MessageCircle size={18} /> Open Chat
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Matches;
