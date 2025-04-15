import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import api from '../api';
import './VideoPreview.css';

const VideoPreview = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [userReaction, setUserReaction] = useState({ liked: false, disliked: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/videos/${id}`);
        setVideo(response.data);
        
        if (user && response.data.reactions) {
          const userReaction = response.data.reactions.find(
            reaction => reaction.userId === user.id
          );
          if (userReaction) {
            setUserReaction({
              liked: userReaction.type === 'like',
              disliked: userReaction.type === 'dislike'
            });
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video. Please try again later.');
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchVideo();
  }, [id, user, isAuthenticated]);

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      try {
        const response = await api.get('/videos');
        const filtered = response.data
          .filter(video => video._id !== id)
          .slice(0, 10);
        setRelatedVideos(filtered);
      } catch (err) {
        console.error('Error fetching related videos:', err);
      }
    };

    if (isAuthenticated) fetchRelatedVideos();
  }, [id, isAuthenticated]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/videos/${id}/comments`);
        setComments(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    if (isAuthenticated) fetchComments();
  }, [id, isAuthenticated]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error('Play error:', err);
          setError('Video playback failed. Check the source file.');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (relatedVideos.length) navigate(`/video/${relatedVideos[0]._id}`);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) videoRef.current.volume = newVolume;
  };

  const handleReaction = async (type) => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    try {
      const endpoint = type === 'like' ? `/videos/${id}/like` : `/videos/${id}/dislike`;
      const res = await api.post(endpoint, { userId: user.id });
      const { likes, dislikes } = res.data;

      setVideo(prev => ({ ...prev, likes, dislikes }));
      setUserReaction(prev => ({
        liked: type === 'like' ? !prev.liked : false,
        disliked: type === 'dislike' ? !prev.disliked : false
      }));
    } catch (err) {
      console.error(`Error handling ${type}:`, err.response?.data || err.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    if (!newComment.trim()) return;
    try {
      const response = await api.post(`/videos/${id}/comments`, { 
        text: newComment,
        userId: user.id
      });
      setComments(prev => [response.data, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  const handleShare = () => {
    const videoUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: video?.title || 'Check out this video on Zionhill TV',
        url: videoUrl
      }).catch(err => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(videoUrl)
        .then(() => alert('Video link copied to clipboard!'))
        .catch(err => console.error('Error copying to clipboard:', err));
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffMs = now - commentTime;
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return `${diffSecs}s ago`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="video-preview-container">
        <Header toggleNav={toggleNav} />
        <div className="video-container loading">
          <div className="loader"></div>
          <p>Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-preview-container">
        <Header toggleNav={toggleNav} />
        <div className="video-container error">
          <p>{error}</p>
          <Link to="/" className="return-home">Return to homepage</Link>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="video-preview-container">
        <Header toggleNav={toggleNav} />
        <div className="video-container error">
          <p>Video not found</p>
          <Link to="/" className="return-home">Return to homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="video-preview-container">
      <Header toggleNav={toggleNav} />
      <Navigation isOpen={isNavOpen} />
      <div className="video-section">
        <div className="video-player-wrapper">
          <video
            ref={videoRef}
            src={`http://localhost:5000${video.url}`}
            poster={`http://localhost:5000${video.image}`}
            className="video-player"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          ></video>
          
          <div className="video-controls">
            <button onClick={togglePlay} className="control-button play-pause">
              <img 
                src={isPlaying ? `${process.env.PUBLIC_URL}/pause.png` : `${process.env.PUBLIC_URL}/play.png`}
                alt={isPlaying ? "Pause" : "Play"} 
                className="control-icon"
              />
            </button>
            <button onClick={handleNext} className="control-button">
              <img src={`${process.env.PUBLIC_URL}/next.png`} alt="Next" className="control-icon" />
            </button>
            <div className="volume-control">
              <img src={`${process.env.PUBLIC_URL}/volume.png`} alt="Volume" className="control-icon" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
            <button className="control-button">
              <img src={`${process.env.PUBLIC_URL}/language.png`} alt="Language" className="control-icon" />
            </button>
            <button className="control-button">
              <img src={`${process.env.PUBLIC_URL}/cast.png`} alt="Cast" className="control-icon" />
            </button>
            <button onClick={() => videoRef.current.requestFullscreen()} className="control-button fullscreen">
              <img src={`${process.env.PUBLIC_URL}/full-screen.png`} alt="Full Screen" className="control-icon" />
            </button>
          </div>
        </div>

        <div className="video-info">
          <h1 className="video-title">{video.title}</h1>
          <p className="video-section-tag">{video.section}</p>
          
          <div className="video-actions">
            <div className="reaction-buttons">
              <button 
                className={`reaction-button ${userReaction.liked ? 'active' : ''}`}
                onClick={() => handleReaction('like')}
              >
                <img src={`${process.env.PUBLIC_URL}/like.png`} alt="Like" className="reaction-icon" />
                <span>{video.likes || 0}</span>
              </button>
              
              <button 
                className={`reaction-button ${userReaction.disliked ? 'active' : ''}`}
                onClick={() => handleReaction('dislike')}
              >
                <img src={`${process.env.PUBLIC_URL}/dislike.png`} alt="Dislike" className="reaction-icon" />
                <span>{video.dislikes || 0}</span>
              </button>
            </div>
            
            <button className="share-button" onClick={handleShare}>
              <img src={`${process.env.PUBLIC_URL}/share.png`} alt="Share" className="reaction-icon" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="comments-section">
          <h2>Comments</h2>
          
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
            />
            <button type="submit" className="comment-submit">Post</button>
          </form>
          
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.user || 'Anonymous'}</span>
                    <span className="comment-time">{formatTime(comment.createdAt)}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>

      <div className="related-videos">
        <h2>Related Videos</h2>
        <div className="related-list">
          {relatedVideos.map((related) => (
            <Link 
              to={`/video/${related._id}`} 
              key={related._id} 
              className="related-video-item"
            >
              <div className="related-thumbnail">
                <img src={`http://localhost:5000${related.image}`} alt={related.title} />
              </div>
              <div className="related-info">
                <h3 className="related-title">{related.title}</h3>
                <span className="related-section">{related.section}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;