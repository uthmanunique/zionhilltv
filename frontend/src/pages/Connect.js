import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import api from '../api';
import './Connect.css';

const Connect = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [group, setGroup] = useState('');
  const [address, setAddress] = useState('');
  const [connectGroups, setConnectGroups] = useState([]);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const handleNameChange = (e) => setName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleGroupChange = (e) => setGroup(e.target.value);
  const handleAddressChange = (e) => setAddress(e.target.value);

  const isSubmitActive = name.trim() !== '' && phone.trim() !== '' && group.trim() !== '' && address.trim() !== '';

  // Fetch connect groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await api.get('/connect/groups');
        setConnectGroups(data);
      } catch (err) {
        console.error('Fetch connect groups error:', err);
        alert('Failed to load connect groups');
      }
    };
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/connect/join', { name, phone, groupName: group, address }); // Removed unused 'data'
      alert('Join request submitted successfully');
      setName('');
      setPhone('');
      setGroup('');
      setAddress('');
    } catch (err) {
      console.error('Join request error:', err);
      alert('Failed to submit join request');
    }
  };

  return (
    <div className="connect-screen">
      <Header toggleNav={toggleNav} />
      <Navigation isOpen={isNavOpen} />
      <main className="connect-content">
        <h1 className="connect-title">Connect Group</h1>
        <div className="connect-groups-grid">
          {connectGroups.map((group, index) => (
            <div key={index} className="connect-group-card">
              <h2 className="group-name">{group.name}</h2>
              <p className="group-activities">{group.activities}</p>
            </div>
          ))}
        </div>
        <div className="join-form">
          <h2 className="form-title">Join A Connect Group</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className={`input-label ${name ? 'active' : ''}`} htmlFor="name">
                Name
              </label>
              <div className="input-wrapper">
                <img src={`${process.env.PUBLIC_URL}/profile.png`} alt="Name Icon" className="input-icon" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  className="input-field"
                />
              </div>
            </div>
            <div className="input-group">
              <label className={`input-label ${phone ? 'active' : ''}`} htmlFor="phone">
                Phone Number
              </label>
              <div className="input-wrapper">
                <img src={`${process.env.PUBLIC_URL}/phone.png`} alt="Phone Icon" className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="input-field"
                />
              </div>
            </div>
            <div className="input-group">
              <label className={`input-label ${group ? 'active' : ''}`} htmlFor="group">
                Name of Connect Group
              </label>
              <div className="input-wrapper">
                <img src={`${process.env.PUBLIC_URL}/connect.png`} alt="Group Icon" className="input-icon" />
                <input
                  type="text"
                  id="group"
                  value={group}
                  onChange={handleGroupChange}
                  className="input-field"
                />
              </div>
            </div>
            <div className="input-group">
              <label className={`input-label ${address ? 'active' : ''}`} htmlFor="address">
                Home Address
              </label>
              <div className="input-wrapper">
                <img src={`${process.env.PUBLIC_URL}/house.png`} alt="Address Icon" className="input-icon" />
                <textarea
                  id="address"
                  value={address}
                  onChange={handleAddressChange}
                  className="input-field textarea"
                />
              </div>
            </div>
            <button
              type="submit"
              className="submit-cta"
              disabled={!isSubmitActive}
              style={{ backgroundColor: isSubmitActive ? '#572668' : '#ccc' }}
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Connect;