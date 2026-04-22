import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Home, User as UserIcon, LogOut, PlusSquare, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to={user ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary-color)', textDecoration: 'none' }}>
          <img src="/logo.png" alt="Flatmate Finder Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          Flatmate Finder
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard"><Home size={18} style={{ marginRight: '4px' }} /> Browse</Link>
              <Link to="/create-listing"><PlusSquare size={18} style={{ marginRight: '4px' }} /> Add Listing</Link>
              <Link to="/profile"><UserIcon size={18} style={{ marginRight: '4px' }} /> Profile</Link>
              <Link to="/matches" className="btn btn-outline" style={{ marginLeft: '0.5rem' }}>Matches</Link>
              <button
                onClick={toggleTheme}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-color)', border: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--primary-color)', marginLeft: '0.5rem' }}
                aria-label="Toggle Theme">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleTheme}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-color)', border: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--primary-color)', marginRight: '0.75rem' }}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
