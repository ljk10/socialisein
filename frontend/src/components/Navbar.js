import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Get 'toggleTheme' and 'theme' as props
const Navbar = ({ toggleTheme, theme }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const myId = localStorage.getItem('userId'); // Get our own ID

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const RENDER_URL = "https://socialisein-backend-ljk10.onrender.com";

  // This useEffect runs when the 'search' state changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (search.trim() === '') {
        setSearchResults([]); // Clear results if search is empty
        return;
      }
      try {
        const res = await axios.get(`${RENDER_URL}/api/users?search=${search}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error('Search failed:', err);
      }
    };

    // "Debounce" the search: wait 300ms after user stops typing
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounce); // Cleanup
  }, [search]); // Re-run whenever 'search' changes

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
        SocialiseIn
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
      
      {/* --- My Profile Link --- */}
      {token && myId && (
         <Link to={`/profile/${myId}`} style={{ margin: '0 15px', fontWeight: '600', color: 'var(--color-accent)', textDecoration: 'none' }}>
          My Profile
        </Link>
      )}
      
      {/* --- Theme Toggle Button --- */}
      {token && (
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
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