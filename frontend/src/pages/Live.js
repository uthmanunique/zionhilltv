import React from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import './Live.css';

const Live = () => {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div className="live-screen">
      <Header toggleNav={toggleNav} />
      <Navigation isOpen={isNavOpen} />
      <main className={`live-content ${isNavOpen ? 'nav-open' : ''}`}>
        <h1>Live Streaming</h1>
        <p>Work in Progress - Streaming features are coming soon!</p>
      </main>
    </div>
  );
};

export default Live;