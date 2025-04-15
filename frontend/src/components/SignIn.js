import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from '../api';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Sending sign-in request:', { email, password });
      const { data } = await api.post('/auth/signin', { email, password });
      console.log('Sign-in response:', data);
      login(data.token); // Set token in AuthContext and localStorage
      // Ensure token is available for the next request
      const { data: user } = await api.get('/auth/me');
      console.log('User data:', user);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      console.error('Sign-in error:', err.response?.data || err.message);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit} className="signin-form">
        <h2>Sign In</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="signin-button">Sign In</button>
        <p className="signup-link">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;