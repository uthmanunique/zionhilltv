import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AdminNavigation from '../components/AdminNavigation';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('General');
  const [generalSettings, setGeneralSettings] = useState({
    siteName: '',
    adminEmail: '',
    maxUploadSize: 0,
  });
  const [moderationSettings, setModerationSettings] = useState({
    requireCommentApproval: false,
    reportThreshold: 0,
  });
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: '',
    logo: '',
  });
  const [auditLog, setAuditLog] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const tabs = ['General', 'Moderation', 'Appearance', 'Audit Log'];

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/admin/settings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setGeneralSettings({
          siteName: data.siteName,
          adminEmail: data.adminEmail,
          maxUploadSize: data.maxUploadSize,
        });
        setModerationSettings({
          requireCommentApproval: data.requireCommentApproval,
          reportThreshold: data.reportThreshold,
        });
        setAppearanceSettings({
          theme: data.theme,
          logo: data.logo,
        });
      } catch (err) {
        console.error('Fetch settings error:', err);
      }
    };

    const fetchAuditLog = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/admin/analytics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAuditLog(data.recentActivity.map(a => ({
          admin: 'Admin', // Placeholder, update with real admin data if available
          action: a.action,
          timestamp: a.time,
        })));
      } catch (err) {
        console.error('Fetch audit log error:', err);
      }
    };

    fetchSettings();
    fetchAuditLog();
  }, []);

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleModerationChange = (e) => {
    const { name, type, value, checked } = e.target;
    setModerationSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Number(value),
    }));
    setIsSaved(false);
  };

  const handleAppearanceChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files[0]) {
      setAppearanceSettings(prev => ({ ...prev, logo: URL.createObjectURL(files[0]) }));
    } else {
      setAppearanceSettings(prev => ({ ...prev, [name]: value }));
    }
    setIsSaved(false);
  };

  const handleSave = async () => {
    try {
      await axios.patch('http://localhost:5000/api/admin/settings', {
        ...generalSettings,
        ...moderationSettings,
        ...appearanceSettings,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error('Save settings error:', err);
    }
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  return (
    <div className="settings-screen">
      <Header toggleNav={toggleNav} />
      <AdminNavigation isOpen={isNavOpen} />
      <main className={`settings-content ${isNavOpen ? 'nav-open' : ''}`}>
        <div className="content-header">
          <h1>Settings</h1>
          <button className="save-button" onClick={handleSave}>
            {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <hr className="divider" />
        <div className="settings-container">
          {activeTab === 'General' && (
            <div className="settings-section">
              <h2>General Settings</h2>
              <div className="form-group">
                <label>Site Name</label>
                <input type="text" name="siteName" value={generalSettings.siteName} onChange={handleGeneralChange} />
              </div>
              <div className="form-group">
                <label>Admin Email</label>
                <input type="email" name="adminEmail" value={generalSettings.adminEmail} onChange={handleGeneralChange} />
              </div>
              <div className="form-group">
                <label>Max Upload Size (MB)</label>
                <input type="number" name="maxUploadSize" value={generalSettings.maxUploadSize} onChange={handleGeneralChange} min="1" />
              </div>
            </div>
          )}
          {activeTab === 'Moderation' && (
            <div className="settings-section">
              <h2>Moderation Settings</h2>
              <div className="form-group">
                <label>Require Comment Approval</label>
                <input type="checkbox" name="requireCommentApproval" checked={moderationSettings.requireCommentApproval} onChange={handleModerationChange} />
              </div>
              <div className="form-group">
                <label>Report Threshold</label>
                <input type="number" name="reportThreshold" value={moderationSettings.reportThreshold} onChange={handleModerationChange} min="1" />
              </div>
            </div>
          )}
          {activeTab === 'Appearance' && (
            <div className="settings-section">
              <h2>Appearance Settings</h2>
              <div className="form-group">
                <label>Theme</label>
                <select name="theme" value={appearanceSettings.theme} onChange={handleAppearanceChange}>
                  <option value="Light">Light</option>
                  <option value="Dark">Dark</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div className="form-group">
                <label>Logo</label>
                <input type="file" name="logo" accept="image/*" onChange={handleAppearanceChange} />
                <img src={appearanceSettings.logo} alt="Logo Preview" className="logo-preview" />
              </div>
            </div>
          )}
          {activeTab === 'Audit Log' && (
            <div className="settings-section">
              <h2>Audit Log</h2>
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Action</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((log, index) => (
                    <tr key={index}>
                      <td>{log.admin}</td>
                      <td>{log.action}</td>
                      <td>{formatTimestamp(log.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;