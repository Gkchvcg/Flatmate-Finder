import React, { useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { Home, Users, Shield, Star, MapPin, Phone, Mail, ChevronDown, ArrowRight, Menu, X, Sun, Moon } from 'lucide-react';

const LandingPage = () => {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const scrollTo = (ref) => {
    if (!ref.current) return;
    const navOffset = 88;
    const elementTop = ref.current.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementTop - navOffset,
      behavior: 'smooth',
    });
    setIsMenuOpen(false);
  };

  return (
    <div className="landing-page">
      {/* ── LANDING NAVBAR ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <Home size={26} />
            <span>Flatmate Finder</span>
          </div>
          <div className="landing-nav-links">
            <button onClick={() => scrollTo(homeRef)}>Home</button>
            <button onClick={() => scrollTo(aboutRef)}>About</button>
            <button onClick={() => scrollTo(contactRef)}>Contact</button>
          </div>
          <button
            type="button"
            className="landing-mobile-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="landing-nav-actions">
            <button 
              onClick={toggleTheme} 
              className="lnd-btn lnd-btn-ghost" 
              style={{ padding: '0.5rem', minWidth: 'auto', marginRight: '0.5rem' }}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/login" className="lnd-btn lnd-btn-outline">Login</Link>
            <Link to="/register" className="lnd-btn lnd-btn-primary">Register</Link>
          </div>
        </div>
        {isMenuOpen && (
          <div className="landing-mobile-menu">
            <button onClick={() => scrollTo(homeRef)}>Home</button>
            <button onClick={() => scrollTo(aboutRef)}>About</button>
            <button onClick={() => scrollTo(contactRef)}>Contact</button>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="home" ref={homeRef} className="lnd-hero">
        <div className="lnd-hero-bg" aria-hidden="true" />
        <div className="lnd-hero-content">
          <span className="lnd-pill">🏠 Find Your Perfect Flatmate</span>
          <h1 className="lnd-hero-title">
            Your Ideal Living <br />
            <span className="lnd-gradient-text">Situation Awaits</span>
          </h1>
          <p className="lnd-hero-sub">
            Connect with compatible flatmates, browse verified listings, and move into your perfect home — all in one place.
          </p>
          <div className="lnd-hero-cta">
            <Link to="/register" className="lnd-btn lnd-btn-primary lnd-btn-lg">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <button onClick={() => scrollTo(aboutRef)} className="lnd-btn lnd-btn-ghost lnd-btn-lg">
              Learn More <ChevronDown size={18} />
            </button>
          </div>
          <div className="lnd-hero-stats">
            <div className="lnd-stat">
              <span className="lnd-stat-number">12k+</span>
              <span className="lnd-stat-label">Active Listings</span>
            </div>
            <div className="lnd-stat-divider" />
            <div className="lnd-stat">
              <span className="lnd-stat-number">8k+</span>
              <span className="lnd-stat-label">Happy Flatmates</span>
            </div>
            <div className="lnd-stat-divider" />
            <div className="lnd-stat">
              <span className="lnd-stat-number">50+</span>
              <span className="lnd-stat-label">Cities Covered</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lnd-features">
        <div className="lnd-section-inner">
          <p className="lnd-section-eyebrow">Why Choose Us</p>
          <h2 className="lnd-section-title">Everything you need to find your flatmate</h2>
          <div className="lnd-features-grid">
            {[
              {
                icon: <Shield size={28} />,
                color: '#6366f1',
                title: 'Verified Profiles',
                desc: 'Every user goes through email verification ensuring you only connect with genuine flatmates.',
              },
              {
                icon: <MapPin size={28} />,
                color: '#10b981',
                title: 'Location-Based Search',
                desc: 'Filter by city, neighbourhood, and budget to find listings closest to your workplace or college.',
              },
              {
                icon: <Users size={28} />,
                color: '#f59e0b',
                title: 'Preference Matching',
                desc: 'Set food habits, gender preference, and smoking/drinking policies to find truly compatible flatmates.',
              },
              {
                icon: <Star size={28} />,
                color: '#ec4899',
                title: 'Interest System',
                desc: 'Express interest in listings and let owners reach back out — no awkward cold calls needed.',
              },
            ].map((f) => (
              <div className="lnd-feature-card" key={f.title}>
                <div className="lnd-feature-icon" style={{ background: f.color + '18', color: f.color }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lnd-how">
        <div className="lnd-section-inner">
          <p className="lnd-section-eyebrow">Simple Steps</p>
          <h2 className="lnd-section-title">How It Works</h2>
          <div className="lnd-steps">
            {[
              { step: '01', title: 'Create an Account', desc: 'Register for free and set up your profile with your preferences and budget.' },
              { step: '02', title: 'Browse Listings', desc: 'Search verified flatmate listings filtered by city, rent, and lifestyle preferences.' },
              { step: '03', title: 'Show Interest', desc: 'Express interest in a property and the owner will get notified instantly.' },
              { step: '04', title: 'Move In!', desc: 'Finalise with the owner and move into your perfect new home with a great flatmate.' },
            ].map((s, i) => (
              <div className="lnd-step" key={s.step}>
                <div className="lnd-step-number">{s.step}</div>
                {i < 3 && <div className="lnd-step-line" />}
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" ref={aboutRef} className="lnd-about">
        <div className="lnd-section-inner lnd-about-inner">
          <div className="lnd-about-text">
            <p className="lnd-section-eyebrow">About Us</p>
            <h2 className="lnd-section-title" style={{ textAlign: 'left' }}>We make finding flatmates simple & stress-free</h2>
            <p className="lnd-about-desc">
              Flatmate Finder was born out of the frustration of searching through unreliable listings and uncomfortable cold outreach. We built a platform that puts verified listings, smart preference matching, and easy communication in one place — so you can focus on finding the right person to share your home with.
            </p>
            <p className="lnd-about-desc">
              Whether you're a student relocating for college, a professional moving to a new city, or a homeowner looking for a reliable flatmate — we've got you covered.
            </p>
            <div className="lnd-about-badges">
              <span className="lnd-badge">🔒 100% Free to Register</span>
              <span className="lnd-badge">🌆 50+ Cities</span>
              <span className="lnd-badge">✅ Verified Users</span>
            </div>
          </div>
          <div className="lnd-about-visual">
            <div className="lnd-about-card">
              <div className="lnd-about-icon"><Users size={36} /></div>
              <h4>Community First</h4>
              <p>We believe the best flatmates come from shared values, not just shared walls.</p>
            </div>
            <div className="lnd-about-card lnd-about-card-offset">
              <div className="lnd-about-icon"><Shield size={36} /></div>
              <h4>Safety Focused</h4>
              <p>All listings are moderated and users are verified before going live.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="lnd-testimonials">
        <div className="lnd-section-inner">
          <p className="lnd-section-eyebrow">What Users Say</p>
          <h2 className="lnd-section-title">Loved by thousands of flatmates</h2>
          <div className="lnd-testimonials-grid">
            {[
              { name: 'Priya S.', city: 'Bangalore', text: 'Found my flatmate within 3 days of posting! The preference filter is brilliant — I got someone who matched my exact lifestyle.', rating: 5 },
              { name: 'Rohan M.', city: 'Mumbai', text: 'As someone who was completely new to the city, this platform was a lifesaver. The listings are genuine and the process is smooth.', rating: 5 },
              { name: 'Anjali K.', city: 'Delhi', text: 'Super easy UI and the interest system saves so much awkward back-and-forth. Highly recommended!', rating: 5 },
            ].map((t) => (
              <div className="lnd-testimonial" key={t.name}>
                <div className="lnd-stars">{'★'.repeat(t.rating)}</div>
                <p className="lnd-testimonial-text">"{t.text}"</p>
                <div className="lnd-testimonial-author">
                  <div className="lnd-avatar">{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" ref={contactRef} className="lnd-contact">
        <div className="lnd-section-inner lnd-contact-inner">
          <div className="lnd-contact-info">
            <p className="lnd-section-eyebrow" style={{ color: '#a5b4fc' }}>Get In Touch</p>
            <h2 className="lnd-section-title" style={{ color: '#fff', textAlign: 'left' }}>Have questions? We'd love to hear from you.</h2>
            <div className="lnd-contact-details">
              <div className="lnd-contact-item">
                <Mail size={20} />
                <span>support@flatmatefinder.in</span>
              </div>
              <div className="lnd-contact-item">
                <Phone size={20} />
                <span>+91 98765 43210</span>
              </div>
              <div className="lnd-contact-item">
                <MapPin size={20} />
                <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>
          </div>
          <form className="lnd-contact-form" onSubmit={(e) => { e.preventDefault(); alert('Message sent! We\'ll get back to you soon.'); }}>
            <div className="lnd-form-row">
              <div className="lnd-form-group">
                <label>Your Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              <div className="lnd-form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" required />
              </div>
            </div>
            <div className="lnd-form-group">
              <label>Subject</label>
              <input type="text" placeholder="How can we help?" required />
            </div>
            <div className="lnd-form-group">
              <label>Message</label>
              <textarea placeholder="Tell us more..." rows={5} required />
            </div>
            <button type="submit" className="lnd-btn lnd-btn-primary lnd-btn-lg" style={{ width: '100%' }}>
              Send Message <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lnd-footer">
        <div className="lnd-section-inner lnd-footer-inner">
          <div className="lnd-footer-brand">
            <div className="landing-logo" style={{ marginBottom: '0.75rem' }}>
              <Home size={22} />
              <span>Flatmate Finder</span>
            </div>
            <p>Making co-living simple, safe, and social.</p>
          </div>
          <div className="lnd-footer-links">
            <span>© 2024 Flatmate Finder. All rights reserved.</span>
            <div className="lnd-footer-nav">
              <button onClick={() => scrollTo(homeRef)}>Home</button>
              <button onClick={() => scrollTo(aboutRef)}>About</button>
              <button onClick={() => scrollTo(contactRef)}>Contact</button>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
