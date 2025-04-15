import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Header from './Header';
import Navigation from './Navigation';
import api from '../api';
import './CategoryPage.css';

const CategoryPage = () => {
  const { category } = useParams();
  const { isAuthenticated } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [items, setItems] = useState([]);

  console.log('CategoryPage: isAuthenticated=', isAuthenticated);

  const titles = {
    'recent-messages': 'Recently Added Messages',
    messages: 'Messages',
    sport: 'Sport',
    music: 'Music',
    news: 'News',
    documentaries: 'Documentaries',
    kiddies: 'Kiddies',
    reelz: 'Reels',
  };

  const title = titles[category] || category;

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await api.get('/videos');
        console.log('Fetched all videos:', data);
        const filteredItems = data.filter(
          item => item.section.toLowerCase() === category.toLowerCase()
        );
        console.log(`Filtered ${category}:`, filteredItems);
        setItems(filteredItems);
      } catch (err) {
        console.error(`Fetch ${category} error:`, err.response ? err.response.data : err.message);
        setItems([]);
      }
    };
    fetchItems();
  }, [category]);

  return (
    <div className="category-screen">
      <Header toggleNav={toggleNav} />
      <Navigation isOpen={isNavOpen} />
      <main className={`category-content ${isNavOpen ? 'nav-open' : ''}`}>
        <div className="category-header-frame">
          <div
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/Zionhilltvlogo.png)`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.1,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
          <h1 className="category-header-title">{title}</h1>
        </div>
        <section className="category-items-section">
          {items.length > 0 ? (
            <div className="category-items-grid">
              {items.map(item => (
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
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/400x220')}
                  />
                  <p className="item-title">{item.title}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p>No items available in this category.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default CategoryPage;