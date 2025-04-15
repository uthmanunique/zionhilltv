import React, { useState } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import api from '../api';
import './Partnership.css';

const Partnership = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const handleNameChange = (e) => setName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNotesChange = (e) => setNotes(e.target.value);

  const isSubmitActive = name.trim() !== '' && phone.trim() !== '' && email.trim() !== '' && notes.trim() !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/partnership', { name, phone, email, notes });
      alert('Partnership request submitted successfully');
      setName('');
      setPhone('');
      setEmail('');
      setNotes('');
    } catch (err) {
      console.error('Partnership submit error:', err.response ? err.response.data : err.message);
      alert('Failed to submit: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="partnership-screen">
      <Header toggleNav={toggleNav} />
      <Navigation isOpen={isNavOpen} />
      <main className="partnership-content">
        <h1 className="partnership-title">Partnership</h1>
        <div className="account-frame">
          <h2 className="account-title">Account Details</h2>
          <div className="account-details">
            <p><strong>Bank:</strong> Zionhill Bank</p>
            <p><strong>Account Number:</strong> 1234-5678-9012</p>
            <p><strong>Routing Number:</strong> 987654321</p>
            <p><strong>Swift Code:</strong> ZHBNUS33</p>
          </div>
        </div>
        <div className="partnership-form">
          <h2 className="form-title">Partnership Form</h2>
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
              <label className={`input-label ${email ? 'active' : ''}`} htmlFor="email">
                Email Address
              </label>
              <div className="input-wrapper">
                <img src={`${process.env.PUBLIC_URL}/sms.png`} alt="Email Icon" className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="input-field"
                />
              </div>
            </div>
            <div className="input-group">
              <label className={`input-label ${notes ? 'active' : ''}`} htmlFor="notes">
                Notes
              </label>
              <div className="input-wrapper">
                <img src={`${process.env.PUBLIC_URL}/note.png`} alt="Notes Icon" className="input-icon" />
                <textarea
                  id="notes"
                  value={notes}
                  onChange={handleNotesChange}
                  className="input-field textarea"
                />
              </div>
            </div>
            <button
            type="submit"
            className="submit-cta"
            disabled={!isSubmitActive || isLoading}
            style={{ backgroundColor: isSubmitActive && !isLoading ? '#572668' : '#ccc' }}
            >
            {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Partnership;