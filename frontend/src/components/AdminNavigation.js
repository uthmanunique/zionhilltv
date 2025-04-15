import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './AdminNavigation.css';

const AdminNavigation = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className={`admin-navigation ${isOpen ? 'open' : ''}`}>
      <div className="profile-section">
        <img
          src={`${process.env.PUBLIC_URL}/user2.png`}
          alt="Profile"
          className="profile-image"
        />
        <span className="profile-name">{user?.email || 'Admin'}</span>
      </div>
      <ul className="nav-menu">
        <li className="nav-item">
          <img src={`${process.env.PUBLIC_URL}/dashboard.png`} alt="Dashboard" className="nav-icon" />
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="nav-item">
          <img src={`${process.env.PUBLIC_URL}/video.png`} alt="Content" className="nav-icon" />
          <Link to="/admin/content">Content Management</Link>
        </li>
        <li className="nav-item">
          <img src={`${process.env.PUBLIC_URL}/frame.png`} alt="Analytics" className="nav-icon" />
          <Link to="/admin/analytics">Analytics</Link>
        </li>
        <li className="nav-item">
          <img src={`${process.env.PUBLIC_URL}/comments.png`} alt="Comments" className="nav-icon" />
          <Link to="/admin/comments">Comments & Reactions</Link>
        </li>
        <li className="nav-item">
          <img src={`${process.env.PUBLIC_URL}/user.png`} alt="Users" className="nav-icon" />
          <Link to="/admin/users">User Management</Link>
        </li>
        <li className="nav-item">
          <img src={`${process.env.PUBLIC_URL}/settings.png`} alt="Settings" className="nav-icon" />
          <Link to="/admin/settings">Settings</Link>
        </li>
        <li className="nav-item" onClick={handleLogout}>
          <img src={`${process.env.PUBLIC_URL}/signout.png`} alt="Logout" className="nav-icon" />
          <span>Logout</span>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavigation;