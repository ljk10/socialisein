import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage'; // 👈 ADD THIS IMPORT

// This simple check is our "authentication"
// A real app would use React Context for this
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// A simple component to protect routes
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/auth" />;
};

// A component to handle the auth page redirect if logged in
const AuthRoute = ({ element }) => {
  return isAuthenticated() ? <Navigate to="/" /> : element;
};

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          {/* 👇 ADD THIS NEW ROUTE 👇 */}
          <Route 
            path="/profile/:userId" 
            element={<ProtectedRoute element={<ProfilePage />} />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
          <Route 
            path="/" 
            element={<ProtectedRoute element={<FeedPage />} />} 
          />
          <Route 
            path="/auth" 
            element={<AuthRoute element={<AuthPage />} />} 
          />
          {/* Any other path redirects to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;