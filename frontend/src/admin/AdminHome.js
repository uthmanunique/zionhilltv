import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import AdminNavigation from '../components/AdminNavigation';
import axios from 'axios';
import './AdminHome.css';

const AdminHome = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalLiveViewers: 0,
    totalCommentsReactions: 0,
    topVideo: 'N/A',
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleCreateDropdown = () => setIsCreateOpen(!isCreateOpen);
  const handleOverlayClick = (e) => {
    if (e.target.className === 'create-overlay') setIsCreateOpen(false);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('https://zionhilltv.onrender.com/api/admin/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStats({
          totalVideos: data.totalVideos || 0,
          totalLiveViewers: data.totalLiveViewers || 0,
          totalCommentsReactions: data.totalCommentsReactions || 0,
          topVideo: data.topVideo || 'N/A',
        });
        setRecentActivity(data.recentActivity || []);
      } catch (err) {
        console.error('Fetch stats error:', err);
        setRecentActivity([]);
      }
    };
    fetchStats();
  }, []);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(date.getDate())}:${pad(date.getMonth() + 1)}:${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  return (
    <div className="admin-home-screen">
      <Header toggleNav={toggleNav} />
      <AdminNavigation isOpen={isNavOpen} />
      <main className={`admin-content ${isNavOpen ? 'nav-open' : ''}`}>
        <div className="admin-header">
          <h1>Welcome to your Dashboard</h1>
          <div className="create-container">
            <button className="create-button" onClick={toggleCreateDropdown}>
              <img src={`${process.env.PUBLIC_URL}/add.png`} alt="Create" className="create-icon" />
              Create
            </button>
            {isCreateOpen && (
              <>
                <div className="create-overlay" onClick={handleOverlayClick}></div>
                <div className="create-dropdown">
                  <Link to="/admin/content/new" className="dropdown-item" onClick={() => setIsCreateOpen(false)}>
                    <img src={`${process.env.PUBLIC_URL}/upload.png`} alt="Upload" className="dropdown-icon" />
                    <span>Upload Video</span>
                  </Link>
                  <Link to="/admin/content/live" className="dropdown-item" onClick={() => setIsCreateOpen(false)}>
                    <img src={`${process.env.PUBLIC_URL}/radar.png`} alt="Live" className="dropdown-icon" />
                    <span>Create Live</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="stats-container">
          <div className="stat-frame">
            <h3>Total Videos</h3>
            <p>{stats.totalVideos}</p>
            <span className="stat-icon" style={{ backgroundColor: '#DCDCDC' }}>
              <img src={`${process.env.PUBLIC_URL}/totalvideos.png`} alt="Videos" />
            </span>
          </div>
          <div className="stat-frame">
            <h3>Total Live Viewers</h3>
            <p>{stats.totalLiveViewers}</p>
            <span className="stat-icon" style={{ backgroundColor: '#DCDCDC' }}>
              <img src={`${process.env.PUBLIC_URL}/viewers.png`} alt="Viewers" />
            </span>
          </div>
          <div className="stat-frame">
            <h3>Total Comments & Reactions</h3>
            <p>{stats.totalCommentsReactions}</p>
            <span className="stat-icon" style={{ backgroundColor: '#DCDCDC' }}>
              <img src={`${process.env.PUBLIC_URL}/reaction.png`} alt="Comments" />
            </span>
          </div>
          <div className="stat-frame">
            <h3>Top Performing Video</h3>
            <p>{stats.topVideo}</p>
            <span className="stat-icon" style={{ backgroundColor: '#DCDCDC' }}>
              <img src={`${process.env.PUBLIC_URL}/performing.png`} alt="Top Video" />
            </span>
          </div>
        </div>
        <div className="recent-activity-section">
          <div className="activity-header">
            <h2>Recent Activity</h2>
            <div className="search-filter">
              <input type="text" placeholder="Search activity..." className="search-bar" />
              <select className="filter-dropdown">
                <option value="all">All</option>
                <option value="video">Video</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
          <table className="activity-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Activity Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.length === 0 ? (
                <tr><td colSpan="3">No recent activity</td></tr>
              ) : (
                recentActivity.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.time ? formatTime(activity.time) : 'N/A'}</td>
                    <td>{activity.type || 'N/A'}</td>
                    <td>{activity.action || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;