import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './UploadVideo.css';

const UploadVideo = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    visibility: 'private',
    tags: '',
    thumbnail: null,
    videoFile: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setFormData({ ...formData, videoFile: file });
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const isFormValid = () => formData.title && formData.category && formData.videoFile;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsUploading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      const { data: video } = await api.post('/admin/videos', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsUploading(false);
      navigate(`/admin/content/review/${video._id}`);
    } catch (err) {
      console.error('Upload error:', err);
      setIsUploading(false);
      alert('Failed to upload video');
    }
  };

  const closeOverlay = () => {
    setIsOpen(false);
    navigate('/admin/content');
  };

  if (!isOpen) return null;

  return (
    <div className="upload-overlay">
      <div className="upload-modal">
        <div className="upload-header">
          <h2>Upload New Video</h2>
          <button className="close-button" onClick={closeOverlay}>
            <img src={`${process.env.PUBLIC_URL}/close.png`} alt="Close" className="close-icon" />
          </button>
        </div>
        <hr className="divider" />
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Video Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter video title"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter video description"
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select a category</option>
              <option value="recent-messages">Recent Messages</option>
              <option value="messages">Messages</option>
              <option value="sport">Sport</option>
              <option value="music">Music</option>
              <option value="news">News</option>
              <option value="documentaries">Documentaries</option>
              <option value="kiddies">Kiddies</option>
              <option value="reelz">Reelz</option>
            </select>
          </div>
          <div className="form-group">
            <label>Visibility</label>
            <select name="visibility" value={formData.visibility} onChange={handleChange}>
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., sermon, worship"
            />
          </div>
          <div className="form-group">
            <label>Thumbnail</label>
            <input type="file" name="thumbnail" accept="image/*" onChange={handleFileChange} />
          </div>
          <div
            className="drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {isUploading ? (
              <div className="loader">Uploading...</div>
            ) : formData.videoFile ? (
              <p className="uploaded-file">{formData.videoFile.name}</p>
            ) : (
              <>
                <img src={`${process.env.PUBLIC_URL}/upload-icon.png`} alt="Upload" className="upload-icon" />
                <p>Drag and Drop video files to upload</p>
                <p className="note">Your videos will be private until you publish them.</p>
              </>
            )}
            <input
              type="file"
              name="videoFile"
              accept="video/*"
              onChange={handleFileChange}
              className="file-input"
            />
            {!isUploading && (
              <button type="button" className="select-file-button" onClick={() => document.querySelector('.file-input').click()}>
                Select File
              </button>
            )}
          </div>
          <button type="submit" className="submit-button" disabled={!isFormValid() || isUploading}>
            Upload and Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;