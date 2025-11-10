import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Make sure Link is imported

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  // Your live backend URL
  const RENDER_URL = "https://socialisein-backend-ljk10.onrender.com";

  // --- 1. Function to fetch all posts ---
  const fetchPosts = async () => {
    try {
      // Use the full Render URL
      const res = await axios.get(`${RENDER_URL}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  // --- 2. useEffect to fetch posts ONCE on page load ---
  useEffect(() => {
    fetchPosts();
  }, []); // The empty array [] means this runs only once on mount

  // --- 3. Function to handle creating a new post ---
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Post cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // We must send the token in the headers
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      // Send the post text AND the auth config, using the full Render URL
      const res = await axios.post(`${RENDER_URL}/api/posts`, { text }, config);

      // Add the new post to the top of the list (using the response)
      setPosts([res.data, ...posts]);
      setText(''); // Clear the textarea
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not create post');
    }
  };

  return (
    <>
      {/* --- CREATE POST FORM --- */}
      <div className="post-form-container fade-in">
        <form className="post-form" onSubmit={handlePostSubmit}>
          <textarea
            placeholder="Start a post"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Post</button>
        </form>
      </div>

      {/* --- POSTS FEED --- */}
      <div className="feed-container fade-in">
        {posts.map((post) => (
          <div key={post._id} className="post-item">
            <div className="post-header">
              {/* This is the simplified header */}
              <Link to={`/profile/${post.user?._id}`}>
                <h3>{post.user?.name || 'User'}</h3>
              </Link>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div className="post-body">
              <p>{post.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FeedPage;