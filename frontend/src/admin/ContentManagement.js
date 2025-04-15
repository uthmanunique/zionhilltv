import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import AdminNavigation from '../components/AdminNavigation';
import axios from 'axios';
import './ContentManagement.css';

const ContentManagement = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All Videos');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [actionDropdown, setActionDropdown] = useState(null);
  const [videos, setVideos] = useState([]);
  const [queue, setQueue] = useState([]);

  const tabs = ['All Videos', 'Upload Queue'];
  const videoHeaders = ['Title', 'Thumbnail', 'Visibility', 'Restrictions', 'Date', 'Views', 'Comments', 'Likes', 'Dislikes', 'Action'];
  const queueHeaders = ['Title', 'Uploader', 'Upload Date', 'Status', 'Action'];

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleCreateDropdown = () => setIsCreateOpen(!isCreateOpen);
  const handleOverlayClick = (e) => {
    if (e.target.className === 'create-overlay') setIsCreateOpen(false);
  };
  const toggleActionDropdown = (id) => setActionDropdown(actionDropdown === id ? null : id);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/admin/videos', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Fetched videos:', data); // Already present
        setVideos(data.filter(v => v.status !== 'Pending') || []);
        setQueue(data.filter(v => v.status === 'Pending') || []);
      } catch (err) {
        console.error('Fetch videos error:', err);
        setVideos([]);
        setQueue([]);
      }
    };
    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/videos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setVideos(videos.filter(v => v.id !== id));
      setQueue(queue.filter(q => q.id !== id));
    } catch (err) {
      console.error('Delete video error:', err);
    }
  };

  const handleQueueAction = async (id, action) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/videos/${id}`, { status: action }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQueue(queue.map(q => q._id === id ? { ...q, status: action } : q));
      if (action === 'Approved') {
        const approved = queue.find(q => q._id === id);
        setVideos([...videos, { ...approved, status: 'Approved' }]);
        setQueue(queue.filter(q => q._id !== id));
      } else if (action === 'Rejected') {
        setQueue(queue.filter(q => q._id !== id));
      }
    } catch (err) {
      console.error('Queue action error:', err);
    }
    setActionDropdown(null);
  };

  const data = activeTab === 'All Videos' ? videos : queue;
  const headers = activeTab === 'All Videos' ? videoHeaders : queueHeaders;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="content-management-screen">
      <Header toggleNav={toggleNav} />
      <AdminNavigation isOpen={isNavOpen} />
      <main className={`content-management-content ${isNavOpen ? 'nav-open' : ''}`}>
        <div className="content-header">
          <h1>Content Management</h1>
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
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
            >
              {tab}
            </button>
          ))}
        </div>
        <hr className="divider" />
        <div className="content-table-container">
          <table className="content-table">
            <thead>
              <tr>
                {headers.map((header, index) => <th key={index}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="no-content">
                    <p>No {activeTab.toLowerCase()} available</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map(item => (
                  <tr key={item._id}>
                    {activeTab === 'All Videos' ? (
                      <>
                        <td>{item.title}</td>
                        <td><img src={`http://localhost:5000${item.image}`} alt={item.title} className="video-thumbnail" /></td>
                        <td>{item.visibility}</td>
                        <td>{item.restrictions || 'none'}</td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td>{item.views}</td>
                        <td>{item.comments}</td>
                        <td>{item.likes}</td>
                        <td>{item.dislikes}</td>
                        <td>
                          <div className="action-container">
                            <button className="action-button" onClick={() => toggleActionDropdown(item._id)}>
                              <img src={`${process.env.PUBLIC_URL}/more.png`} alt="More" className="more-icon" />
                            </button>
                            {actionDropdown === item._id && (
                              <div className="action-dropdown">
                                <button className="dropdown-item" onClick={() => handleDelete(item._id)}>
                                  <img src={`${process.env.PUBLIC_URL}/delete.png`} alt="Delete" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{item.title}</td>
                        <td>{item.uploader || 'Unknown'}</td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td>{item.status}</td>
                        <td>
                          <div className="action-container">
                            <button className="action-button" onClick={() => toggleActionDropdown(item._id)}>
                              <img src={`${process.env.PUBLIC_URL}/more.png`} alt="More" className="more-icon" />
                            </button>
                            {actionDropdown === item._id && (
                              <div className="action-dropdown">
                                <button className="dropdown-item" onClick={() => handleQueueAction(item._id, 'Approved')}>
                                  <img src={`${process.env.PUBLIC_URL}/approve.png`} alt="Approve" />
                                  Approve
                                </button>
                                <button className="dropdown-item" onClick={() => handleQueueAction(item._id, 'Rejected')}>
                                  <img src={`${process.env.PUBLIC_URL}/reject.png`} alt="Reject" />
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination-footer">
          <div className="show-results">
            <span>Show results:</span>
            <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="pagination-controls">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
              <img src={`${process.env.PUBLIC_URL}/left-arrow.png`} alt="Previous" />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
              <img src={`${process.env.PUBLIC_URL}/right-arrow.png`} alt="Next" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentManagement;