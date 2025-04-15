import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import AdminNavigation from '../components/AdminNavigation';
import axios from 'axios';
import './CommentReaction.css';

const CommentReaction = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Comments');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [actionDropdown, setActionDropdown] = useState(null);
  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState([]);

  const tabs = ['Comments', 'Reactions'];
  const commentHeaders = ['Username', 'Comment', 'Date', 'Time', 'Reason', 'Action'];
  const reactionHeaders = ['Username', 'Reaction', 'Date', 'Time', 'Action'];

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleCreateDropdown = () => setIsCreateOpen(!isCreateOpen);
  const handleOverlayClick = (e) => {
    if (e.target.className === 'create-overlay') setIsCreateOpen(false);
  };
  const toggleActionDropdown = (id) => setActionDropdown(actionDropdown === id ? null : id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commentsRes, reactionsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/comments', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:5000/api/admin/reactions', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        setComments(commentsRes.data);
        setReactions(reactionsRes.data);
      } catch (err) {
        console.error('Fetch data error:', err);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id, type) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/${type}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (type === 'comments') setComments(comments.filter(c => c._id !== id));
      else setReactions(reactions.filter(r => r._id !== id));
    } catch (err) {
      console.error(`Delete ${type} error:`, err);
    }
    setActionDropdown(null);
  };

  const data = activeTab === 'Comments' ? comments : reactions;
  const headers = activeTab === 'Comments' ? commentHeaders : reactionHeaders;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="comment-reaction-screen">
      <Header toggleNav={toggleNav} />
      <AdminNavigation isOpen={isNavOpen} />
      <main className={`comment-reaction-content ${isNavOpen ? 'nav-open' : ''}`}>
        <div className="content-header">
          <h1>Comment & Reaction Management</h1>
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
                    {activeTab === 'Comments' ? (
                      <>
                        <td>{item.username}</td>
                        <td>{item.text}</td>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>{item.time || 'N/A'}</td>
                        <td>{item.reportedReason || 'N/A'}</td>
                        <td>
                          <div className="action-container">
                            <button className="action-button" onClick={() => toggleActionDropdown(item._id)}>
                              <img src={`${process.env.PUBLIC_URL}/more.png`} alt="More" className="more-icon" />
                            </button>
                            {actionDropdown === item._id && (
                              <div className="action-dropdown">
                                <button className="dropdown-item" onClick={() => handleDelete(item._id, 'comments')}>
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
                        <td>{item.username}</td>
                        <td>{item.reaction}</td>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>{item.time || 'N/A'}</td>
                        <td>
                          <div className="action-container">
                            <button className="action-button" onClick={() => toggleActionDropdown(item._id)}>
                              <img src={`${process.env.PUBLIC_URL}/more.png`} alt="More" className="more-icon" />
                            </button>
                            {actionDropdown === item._id && (
                              <div className="action-dropdown">
                                <button className="dropdown-item" onClick={() => handleDelete(item._id, 'reactions')}>
                                  <img src={`${process.env.PUBLIC_URL}/delete.png`} alt="Delete" />
                                  Delete
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

export default CommentReaction;