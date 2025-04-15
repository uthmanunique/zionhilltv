import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Header from '../components/Header';
import AdminNavigation from '../components/AdminNavigation';
import axios from 'axios';
import './Analytics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalLiveViewers: 0,
    totalCommentsReactions: 0,
    topVideo: 'N/A',
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [engagement, setEngagement] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [videoPerformance, setVideoPerformance] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleCreateDropdown = () => setIsCreateOpen(!isCreateOpen);
  const handleOverlayClick = (e) => {
    if (e.target.className === 'create-overlay') setIsCreateOpen(false);
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get('https://zionhilltv.onrender.com/api/admin/analytics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Analytics data:', data); // Debug
        setStats({
          totalVideos: data.totalVideos || 0,
          totalLiveViewers: data.totalLiveViewers || 0,
          totalCommentsReactions: data.totalCommentsReactions || 0,
          topVideo: data.topVideo || 'N/A',
        });
        setRecentActivity(data.recentActivity || []);
        setEngagement(data.engagement || []);
        setReactions(data.reactions || []);
        setVideoPerformance(data.videoPerformance || []);
      } catch (err) {
        console.error('Fetch analytics error:', err);
      }
    };
    fetchAnalytics();
  }, []);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(date.getDate())}:${pad(date.getMonth() + 1)}:${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const barData = {
    labels: engagement.map(e => e.day),
    datasets: [{
      label: 'Viewers',
      data: engagement.map(e => e.viewers),
      backgroundColor: '#572668',
      borderColor: '#431d52',
      borderWidth: 1,
      borderRadius: 4,
      barThickness: 20,
    }],
  };

  const barOptions = {
    maintainAspectRatio: false,
    scales: { x: { title: { display: true, text: 'Days' } }, y: { title: { display: true, text: 'Viewers' }, beginAtZero: true } },
    plugins: { legend: { display: false } },
  };

  const pieData = {
    labels: reactions.map(r => r.type),
    datasets: [{
      data: reactions.map(r => r.count),
      backgroundColor: ['#28a745', '#dc3545', '#ff6f61', '#ffc107'],
      borderColor: '#fff',
      borderWidth: 1,
    }],
  };

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } },
  };

  return (
    <div className="analytics-screen">
      <Header toggleNav={toggleNav} />
      <AdminNavigation isOpen={isNavOpen} />
      <main className={`analytics-content ${isNavOpen ? 'nav-open' : ''}`}>
        <div className="admin-header">
          <h1>Analytics</h1>
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
        <div className="charts-section">
          <div className="chart-container">
            <h2>Engagement Rate</h2>
            <div className="chart-wrapper">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
          <div className="chart-container">
            <h2>Reaction Distribution</h2>
            <div className="chart-wrapper">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>
        <div className="video-performance-section">
          <h2>Video Performance</h2>
          <table className="performance-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {videoPerformance.map((video, index) => (
                <tr key={index}>
                  <td>{video.title}</td>
                  <td>{video.views}</td>
                  <td>{video.likes}</td>
                  <td>{video.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default Analytics;