import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phone: formData.phone.trim(),
    };

    if (!payload.name || !payload.email || !payload.password) {
      setError('Please fill all required fields.');
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(payload.email)) {
      setError('Please enter a valid email address (e.g., example@gmail.com).');
      setIsSubmitting(false);
      return;
    }

    if (payload.phone) {
      // Remove any non-numeric characters
      const phoneDigits = payload.phone.replace(/\D/g, '');
      
      // If starts with 91 and has 12 digits, extract the 10 digit number
      let basePhone = phoneDigits;
      if (phoneDigits.length === 12 && phoneDigits.startsWith('91')) {
        basePhone = phoneDigits.slice(2);
      }
      
      if (basePhone.length !== 10) {
        setError('Phone number must be exactly 10 digits.');
        setIsSubmitting(false);
        return;
      }
      payload.phone = '+91' + basePhone;
    }

    try {
      const response = await api.post('/auth/register', payload);
      setSuccess(response.data.message || 'Registration successful! Please check your email to verify your account.');
      setFormData({ name: '', email: '', password: '', phone: '' });
      // We don't call login() here because they need to verify email first
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form">
      <h2 className="page-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create an account</h2>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '1rem', backgroundColor: '#FEF2F2', borderRadius: '8px', border: '1px solid #FCA5A5' }}>{error}</div>}
      {success && (
        <div style={{ color: '#065F46', marginBottom: '1rem', padding: '1rem', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #34D399', textAlign: 'center' }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Check your email!</p>
          <p style={{ fontSize: '0.9rem' }}>{success}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-control"
            placeholder="+91 XXXXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            maxLength="13"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
};

export default Register;
