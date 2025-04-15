import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import AdminNavigation from '../components/AdminNavigation';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All Users');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [actionDropdown, setActionDropdown] = useState(null);
  const [users, setUsers] = useState([]);

  const tabs = ['All Users', 'Active', 'Suspended'];
  const headers = ['Username', 'Email', 'Status', 'Role', 'Joined', 'Action'];

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleCreateDropdown = () => setIsCreateOpen(!isCreateOpen);
  const handleOverlayClick = (e) => {
    if (e.target.className === 'create-overlay') setIsCreateOpen(false);
  };
  const toggleActionDropdown = (id) => setActionDropdown(actionDropdown === id ? null : id);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(data);
      } catch (err) {
        console.error('Fetch users error:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await axios.patch(`http://localhost:5000/api/admin/users/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(users.map(u => u._id === id ? data : u));
    } catch (err) {
      console.error('Status change error:', err);
    }
    setActionDropdown(null);
  };

  const filteredUsers = users.filter(user => {
    if (activeTab === 'All Users') return true;
    return user.status.toLowerCase() === activeTab.toLowerCase();
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="user-management-screen">
      <Header toggleNav={toggleNav} />
      <AdminNavigation isOpen={isNavOpen} />
      <main className={`user-management-content ${isNavOpen ? 'nav-open' : ''}`}>
        <div className="content-header">
          <h1>User Management</h1>
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
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="no-content">
                    <p>No {activeTab.toLowerCase()} available</p>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td><span className={`status-${user.status.toLowerCase()}`}>{user.status}</span></td>
                    <td>{user.role}</td>
                    <td>{new Date(user.joined).toLocaleDateString()}</td>
                    <td>
                      <div className="action-container">
                        <button className="action-button" onClick={() => toggleActionDropdown(user._id)}>
                          <img src={`${process.env.PUBLIC_URL}/more.png`} alt="More" className="more-icon" />
                        </button>
                        {actionDropdown === user._id && (
                          <div className="action-dropdown">
                            <button className="dropdown-item" onClick={() => handleStatusChange(user._id, 'Active')}>
                              <img src={`${process.env.PUBLIC_URL}/activate.png`} alt="Activate" />
                              Activate
                            </button>
                            <button className="dropdown-item" onClick={() => handleStatusChange(user._id, 'Suspended')}>
                              <img src={`${process.env.PUBLIC_URL}/suspend.png`} alt="Suspend" />
                              Suspend
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
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

export default UserManagement;