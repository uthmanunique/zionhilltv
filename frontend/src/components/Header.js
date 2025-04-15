// frontend/src/components/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Header.css';

const Header = ({ toggleNav }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/signin');
  };

  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);

  const handleOverlayClick = (e) => {
    if (e.target.className === 'profile-overlay') setIsProfileOpen(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger" onClick={toggleNav}>
          <img src={`${process.env.PUBLIC_URL}/hambuger.png`} alt="Menu" className="hamburger-icon" />
        </button>
        <Link to="/">
          <img src={`${process.env.PUBLIC_URL}/Zionhilltvlogo.png`} alt="Web Logo" className="logo" />
        </Link>
      </div>
      <div className="header-center">
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <img src={`${process.env.PUBLIC_URL}/search-normal.png`} alt="Search Icon" className="search-icon" />
          </button>
        </form>
      </div>
      <div className="header-right">
        {isAuthenticated && user ? (
          <div className="profile-container">
            <div className="profile-link" onClick={toggleProfileDropdown}>
              <div className="profile-btn">
                <span className="profile-moniker">{user.email.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            {isProfileOpen && (
              <>
                <div className="profile-overlay" onClick={handleOverlayClick}></div>
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <div className="dropdown-info">
                      <span className="dropdown-username">{user.email}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    <img src={`${process.env.PUBLIC_URL}/signout.png`} alt="Sign Out" className="dropdown-icon" />
                    <span>Sign Out</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link to="/signin" className="signin-link">
            <button className="signin-btn">
              <img src={`${process.env.PUBLIC_URL}/profile.png`} alt="Sign In Icon" className="signin-icon" />
              Sign In
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;