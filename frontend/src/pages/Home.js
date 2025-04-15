import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import api from '../api';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [sections, setSections] = useState({
    'recent-messages': [],
    messages: [],
    sport: [],
    music: [],
    news: [],
    documentaries: [],
    kiddies: [],
    reelz: [],
  });

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const sectionTitles = {
    'recent-messages': 'Recently Added Messages',
    messages: 'Messages',
    sport: 'Sport',
    music: 'Music',
    news: 'News',
    documentaries: 'Documentaries',
    kiddies: 'Kiddies',
    reelz: 'Reels',
  };

  const categories = Object.keys(sectionTitles);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await api.get('/videos');
        console.log('Fetched videos:', data);
        const updatedSections = categories.reduce((acc, category) => {
          acc[category] = data
            .filter(video => video.section.toLowerCase() === category.toLowerCase())
            .slice(0, 7);
          return acc;
        }, {});
        console.log('Updated sections:', updatedSections);
        setSections(updatedSections);
      } catch (err) {
        console.error('Fetch videos error:', err.response ? err.response.data : err.message);
      }
    };
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home-screen">
      <Header toggleNav={toggleNav} />
      <Navigation isOpen={isNavOpen} />
      <main className={`home-content ${isNavOpen ? 'nav-open' : ''}`}>
        <Hero />
        {user?.role === 'admin' && (
          <Link to="/admin" style={{ margin: '20px', display: 'block' }}>
            Go to Admin Dashboard
          </Link>
        )}
        <section className="reelz">
          <h2 className="reelz-head">{sectionTitles.reelz}</h2>
          <div className="reelz-grid">
            {sections.reelz.length > 0 ? (
              sections.reelz.map(reel => (
                <Link to={`/video/${reel._id}`} key={reel._id} className="reelz-frame">
                  <img
                    src={reel.image ? `http://localhost:5000${reel.image}` : 'https://via.placeholder.com/220x400'}
                    alt={reel.title}
                    className="reelz-image"
                    style={{
                      width: '100%',
                      height: '400px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/220x400')} // Fallback on load failure
                  />
                  <p className="reelz-title">{reel.title}</p>
                </Link>
              ))
            ) : (
              <p>No reelz available</p>
            )}
          </div>
        </section>
        {Object.entries(sections)
          .filter(([cat]) => cat !== 'reelz')
          .map(([category, items]) => (
            <section key={category} className="home-section">
              <div className="section-header">
                <h2 className="section-title">{sectionTitles[category]}</h2>
                <Link to={`/${category}`} className="see-all-link">
                  See All
                  <img
                    src={`${process.env.PUBLIC_URL}/arrowright.png`}
                    alt="Arrow Right"
                    className="see-all-arrow"
                  />
                </Link>
              </div>
              <div className="section-grid">
                {items.length > 0 ? (
                  items.map(item => (
                    <Link to={`/video/${item._id}`} key={item._id} className="item-frame">
                      <img
                        src={item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/400x220'}
                        alt={item.title}
                        className="item-image"
                        style={{
                          width: '100%',
                          height: '220px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                        }}
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/400x220')} // Fallback on load failure
                      />
                      <p className="item-title">{item.title}</p>
                    </Link>
                  ))
                ) : (
                  <p>No items in {category}</p>
                )}
              </div>
            </section>
          ))}
      </main>
    </div>
  );
};

export default Home;