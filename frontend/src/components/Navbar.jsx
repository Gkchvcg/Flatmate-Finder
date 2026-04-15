import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, User as UserIcon, LogOut, PlusSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to={user ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary-color)' }}>
          <Home size={24} />
          Flatmate Finder
        </Link>
        
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard"><Home size={18} style={{marginRight:'4px'}}/> Browse</Link>
              <Link to="/create-listing"><PlusSquare size={18} style={{marginRight:'4px'}}/> Add Listing</Link>
              <Link to="/profile"><UserIcon size={18} style={{marginRight:'4px'}}/> Profile</Link>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
