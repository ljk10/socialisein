import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Navigate to auth page after logout
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">SimpleLinkedIn</span>
      {token && (
        <button onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;