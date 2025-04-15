import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      bgImage: `${process.env.PUBLIC_URL}/event1.png`,
      title: "Experience the Word Anytime, Anywhere",
      description:
        "The Ultimate Worship Session is a Transformative Christian Video that brings together the best of Christian Music, Sermons, and more.",
    },
    {
      bgImage: `${process.env.PUBLIC_URL}/event2.png`,
      title: "Join Our Next Live Event",
      description: "Connect with us live for an inspiring session of faith and community.",
    },
    {
      bgImage: `${process.env.PUBLIC_URL}/event4.jpg`,
      title: "Discover New Sermons",
      description: "Explore our latest teachings and grow in your spiritual journey.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <section className="hero">
      <div
        className="hero-slide"
        style={{ backgroundImage: `url(${slides[currentSlide].bgImage})` }}
      >
        <div className="hero-content">
          <div className="zionhill-frame">
            <span>Zionhill TV</span>
          </div>
          <h1 className="hero-title">{slides[currentSlide].title}</h1>
          <p className="hero-description">{slides[currentSlide].description}</p>
          <Link to="/live/1">
            <button className="hero-cta">Stream Our Service</button>
          </Link>
        </div>
        <div className="carousel-controls">
          <button className="carousel-prev" onClick={prevSlide}>‹</button>
          <button className="carousel-next" onClick={nextSlide}>›</button>
        </div>
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;