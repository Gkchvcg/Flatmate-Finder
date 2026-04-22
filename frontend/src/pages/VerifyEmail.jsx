import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await api.get(`/auth/verify/${token}`);
                setStatus('success');
                setMessage(res.data.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            }
        };
        verify();
    }, [token]);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ 
                    maxWidth: '500px', 
                    width: '100%', 
                    background: 'var(--card-bg)', 
                    padding: '3rem', 
                    borderRadius: '1.5rem', 
                    textAlign: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                {status === 'loading' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ 
                                width: '80px', 
                                height: '80px', 
                                borderRadius: '50%', 
                                border: '4px solid var(--primary-color)', 
                                borderTopColor: 'transparent',
                                animation: 'spin 1s linear infinite'
                            }} />
                            <Mail size={32} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--primary-color)' }} />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Verifying your email...</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Please wait while we confirm your identity.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                            style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <CheckCircle size={48} color="#10b981" />
                        </motion.div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-color)' }}>Awesome!</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{message}</p>
                        <Link to="/login" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            Go to Login <ArrowRight size={18} />
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                            style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <XCircle size={48} color="#ef4444" />
                        </motion.div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-color)' }}>Verification Failed</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{message}</p>
                        <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
                            <Link to="/register" className="btn btn-outline" style={{ flex: 1 }}>Register Again</Link>
                            <Link to="/login" className="btn btn-primary" style={{ flex: 1 }}>Back to Login</Link>
                        </div>
                    </div>
                )}
            </motion.div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default VerifyEmail;
