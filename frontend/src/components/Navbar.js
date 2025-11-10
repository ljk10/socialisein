import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const myId = localStorage.getItem('userId'); // Get our own ID

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const RENDER_URL = "https://socialisein-backend-ljk10.onrender.com";

  useEffect(() => {
    const fetchUsers = async () => {
      if (search.trim() === '') {
        setSearchResults([]);
        return;
      }
      try {
        const res = await axios.get(`${RENDER_URL}/api/users?search=${search}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error('Search failed:', err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Clear our ID on logout
    navigate('/auth');
  };

  const clearSearch = () => {
    setSearch('');
    setSearchResults([]);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={clearSearch}>
        SimpleLinkedIn
      </Link>

      {/* --- Search Bar with Dropdown --- */}
      {token && (
        <div className="search-container" style={{ flex: 1, margin: '0 20px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search for users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
          {searchResults.length > 0 && (
            <ul className="search-dropdown">
              {searchResults.map((user) => (
                <li key={user._id}>
                  <Link to={`/profile/${user._id}`} onClick={clearSearch}>
                    {user.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {/* --- My Profile Link (Text) --- */}
      {token && myId && (
         <Link to={`/profile/${myId}`} style={{ margin: '0 15px', fontWeight: '600', color: '#0a66c2', textDecoration: 'none' }}>
          My Profile
        </Link>
      )}
      
      {/* --- Logout Button --- */}
      {token && (
        <button onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;