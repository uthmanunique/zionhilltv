import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import api from '../api';
import './PraiseReport.css';

const PraiseReport = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [media, setMedia] = useState(null);
  const [report, setReport] = useState('');
  const [praiseReports, setPraiseReports] = useState([]);
  const fileInputRef = useRef(null);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const handleNameChange = (e) => setName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleMediaChange = (e) => setMedia(e.target.files[0]);
  const handleReportChange = (e) => setReport(e.target.value);
  const handleClipClick = () => fileInputRef.current.click();

  const isSubmitActive = name.trim() !== '' && phone.trim() !== '' && media && report.trim() !== '';

  // Fetch praise reports on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get('/praise-report');
        setPraiseReports(data.map(report => ({
          media: `https://zionhilltv.onrender.com${report.media}`, // Adjust base URL as needed
          title: report.report.substring(0, 20) + '...', // Shortened title
        })));
      } catch (err) {
        console.error('Fetch praise reports error:', err);
        alert('Failed to load praise reports');
      }
    };
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('media', media);
    formData.append('report', report);
    try {
      const { data } = await api.post('/praise-report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Praise report submitted successfully');
      setName('');
      setPhone('');
      setMedia(null);
      setReport('');
      setPraiseReports([...praiseReports, {
        media: `https://zionhilltv.onrender.com${data.praiseReport.media}`,
        title: data.praiseReport.report.substring(0, 20) + '...',
      }]);
    } catch (err) {
      console.error('Praise report submit error:', err);
      alert('Failed to submit praise report');
    }
  };

  useEffect(() => {
    if (praiseReports.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % praiseReports.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [praiseReports.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % praiseReports.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + praiseReports.length) % praiseReports.length);
  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <div className="praise-report-screen">
      <Header toggleNav={toggleNav} />
      <Navigation isOpen={isNavOpen} />
      <main className="praise-report-content">
        <h1 className="praise-report-title">Praise Report</h1>
        <div className="praise-report-carousel">
          {praiseReports.length > 0 ? (
            <div className="carousel-slide">
              {praiseReports[currentSlide].media.endsWith('.mp4') ? (
                <video
                  src={praiseReports[currentSlide].media}
                  controls
                  autoPlay
                  muted
                  loop
                  className="carousel-media"
                />
              ) : (
                <img
                  src={praiseReports[currentSlide].media}
                  alt={praiseReports[currentSlide].title}
                  className="carousel-media"
                />
              )}
              <div className="carousel-caption">{praiseReports[currentSlide].title}</div>
            </div>
          ) : (
            <div>No praise reports available</div>
          )}
          {praiseReports.length > 1 && (
            <>
              <div className="carousel-controls">
                <button className="carousel-prev" onClick={prevSlide}>‹</button>
                <button className="carousel-next" onClick={nextSlide}>›</button>
              </div>
              <div className="carousel-dots">
                {praiseReports.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="submit-form">
          <h2 className="form-title">Submit Your Praise Report</h2>
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
              <label className={`input-label ${media ? 'active' : ''}`} htmlFor="media">
                Picture/Video
              </label>
              <div className="input-wrapper">
                <img src={`${process.env.PUBLIC_URL}/media.png`} alt="Media Icon" className="input-icon" />
                <input
                  type="file"
                  id="media"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="input-field file-input"
                  ref={fileInputRef}
                  hidden
                />
                <div className="file-display">{media ? media.name : ''}</div>
                <img
                  src={`${process.env.PUBLIC_URL}/clip.png`}
                  alt="Clip Icon"
                  className="file-icon"
                  onClick={handleClipClick}
                />
              </div>
            </div>
            <div className="input-group">
              <label className={`input-label ${report ? 'active' : ''}`} htmlFor="report">
                Type Your Praise Report
              </label>
              <div className="input-wrapper">
                <img src={`${process.env.PUBLIC_URL}/note.png`} alt="Report Icon" className="input-icon" />
                <textarea
                  id="report"
                  value={report}
                  onChange={handleReportChange}
                  className="input-field textarea"
                />
              </div>
            </div>
            <p className="contact-info">
              For more enquiries, please contact the number below: <strong>+2349012676322</strong>
            </p>
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

export default PraiseReport;