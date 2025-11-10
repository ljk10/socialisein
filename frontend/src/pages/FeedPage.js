import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState(''); // 'error' is now used in the JSX

  // Your live backend URL
  const RENDER_URL = "https://socialisein-backend-ljk10.onrender.com";
  // Get the logged-in user's ID
  const myId = localStorage.getItem('userId');

  // --- 1. Function to fetch all posts ---
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${RENDER_URL}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // --- 2. Function to handle creating a new post ---
  const handlePostSubmit = async (e) => { // 'handlePostSubmit' is now used in the JSX
    e.preventDefault();
    setError('');
    if (!text.trim()) {
      setError('Post cannot be empty');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.post(`${RENDER_URL}/api/posts`, { text }, config);
      setPosts([res.data, ...posts]);
      setText('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not create post');
    }
  };

  // --- 3. Function to handle deleting a post ---
  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        
        await axios.delete(`${RENDER_URL}/api/posts/${postId}`, config);
        
        setPosts(posts.filter((post) => post._id !== postId));
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  return (
    <>
      {/* --- CREATE POST FORM --- */}
      <div className="post-form-container fade-in">
        {/* 👇 THE FIX IS HERE 👇 */}
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
              <Link to={`/profile/${post.user?._id}`}>
                <h3>{post.user?.name || 'User'}</h3>
              </Link>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div className="post-body">
              <p>{post.text}</p>
            </div>
            
            {post.user?._id === myId && (
              <button 
                className="delete-post-btn"
                onClick={() => handleDelete(post._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default FeedPage;