import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Home from './pages/Home';
import Live from './pages/Live';
import SignIn from './components/SignIn';
import Signup from './components/Signup';
import CategoryPage from './components/CategoryPage';
import AdminHome from './admin/AdminHome';
import ContentManagement from './admin/ContentManagement';
import UploadVideo from './admin/UploadVideo';
import ReviewVideo from './admin/ReviewVideo';
import CommentReaction from './admin/CommentReaction';
import UserManagement from './admin/UserManagement';
import Settings from './admin/Settings'; // Added
import Analytics from './admin/Analytics'; // Added
import Partnership from './pages/Partnership';
import Connect from './pages/Connect'; // Added
import PraiseReport from './pages/PraiseReport'; // Added
import VideoPreview from './pages/VideoPreview'; // Added

// Additional imports for Analytics (to be built later)

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/live/1" element={<Live />} />
          <Route path="/:category" element={<ProtectedRoute element={CategoryPage} />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/connect-screen" element={<Connect />} />
          <Route path="/praise-report" element={<PraiseReport />} />
          <Route path="/video/:id" element={<VideoPreview />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminProtectedRoute element={AdminHome} />} />
          <Route path="/admin/content" element={<AdminProtectedRoute element={ContentManagement} />} />
          <Route path="/admin/content/new" element={<AdminProtectedRoute element={UploadVideo} />} />
          <Route path="/admin/content/review/:id" element={<AdminProtectedRoute element={ReviewVideo} />} />
          <Route path="/admin/comments" element={<AdminProtectedRoute element={CommentReaction} />} />
          <Route path="/admin/users" element={<AdminProtectedRoute element={UserManagement} />} />
          <Route path="/admin/settings" element={<AdminProtectedRoute element={Settings} />} />
          <Route path="/admin/analytics" element={<AdminProtectedRoute element={Analytics} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Placeholder for Analytics (to be built later)
// const Analytics = () => <div>Analytics Page (Coming Soon)</div>;

export default App;