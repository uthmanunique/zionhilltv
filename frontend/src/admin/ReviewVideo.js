import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './ReviewVideo.css';

const ReviewVideo = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await api.get(`/admin/videos/${id}`);
        console.log('Fetched video:', data); // Debug
        setVideo(data);
      } catch (err) {
        console.error('Fetch video error:', err);
        navigate('/admin/content');
      }
    };
    fetchVideo();
  }, [id, navigate]);

  const handlePublish = async () => {
    try {
      await api.put(`/admin/videos/${id}`, { visibility: 'public' });
      navigate('/admin/content');
    } catch (err) {
      console.error('Publish error:', err);
      alert('Failed to publish video');
    }
  };

  const handleBack = () => navigate('/admin/content/new');

  if (!video) return <div>Loading...</div>;

  return (
    <div className="review-overlay">
      <div className="review-modal">
        <div className="review-header">
          <h2>Review Video</h2>
          <button className="close-button" onClick={() => navigate('/admin/content')}>
            <img src={`${process.env.PUBLIC_URL}/close.png`} alt="Close" className="close-icon" />
          </button>
        </div>
        <hr className="divider" />
        <div className="review-content">
          <h3>{video.title}</h3>
          <p>{video.description || 'No description'}</p>
          <p><strong>Category:</strong> {video.section}</p>
          <p><strong>Visibility:</strong> {video.visibility}</p>
          <p><strong>Tags:</strong> {video.tags?.join(', ') || 'None'}</p>
          
          {video.image && (
            <img src={`http://localhost:5000${video.image}`} alt="Thumbnail" className="thumbnail-preview" />
          )}
          {video.url && ( // Changed from videoUrl to url
            <video controls className="video-preview">
              <source src={`http://localhost:5000${video.url}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className="review-actions">
          <button className="back-button" onClick={handleBack}>Back to Edit</button>
          <button className="publish-button" onClick={handlePublish}>Publish</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewVideo;