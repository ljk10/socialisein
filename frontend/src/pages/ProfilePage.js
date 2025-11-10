import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'; // 👈 THE FIX IS HERE

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const { userId } = useParams();

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editHeadline, setEditHeadline] = useState('');

  const RENDER_URL = "https://socialisein-backend-ljk10.onrender.com";
  const loggedInUserId = localStorage.getItem('userId');
  const isMyProfile = userId === loggedInUserId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await axios.get(`${RENDER_URL}/api/users/${userId}`);
        setUser(userRes.data);
        // Set edit fields
        setEditName(userRes.data.name);
        setEditBio(userRes.data.bio || '');
        setEditHeadline(userRes.data.headline || '');

        const postsRes = await axios.get(`${RENDER_URL}/api/posts/user/${userId}`);
        setPosts(postsRes.data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };

    fetchUserData();
  }, [userId]);

  // For text fields (name, bio, headline)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
    const body = { name: editName, bio: editBio, headline: editHeadline };
    try {
      const res = await axios.put(`${RENDER_URL}/api/users/profile`, body, config);
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      {/* --- USER HEADER --- */}
      <div className="profile-header fade-in" style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', position: 'relative' }}>
        
        {/* --- View Mode --- */}
        {!isEditing && (
          <>
            <h1>{user.name}</h1>
            <h3 style={{ color: '#555', fontWeight: 400, marginBottom: '10px' }}>{user.headline || 'No headline'}</h3>
            <p style={{ marginBottom: '10px' }}>{user.bio || 'This user has no bio.'}</p>
            <p style={{ color: '#777' }}>{user.email}</p>
            {isMyProfile && (
              <button onClick={() => setIsEditing(true)} style={{ position: 'absolute', top: '20px', right: '20px' }}>
                Edit Profile
              </button>
            )}
          </>
        )}

        {/* --- Edit Mode --- */}
        {isEditing && isMyProfile && (
          <form onSubmit={handleEditSubmit}>
            <h2>Edit Profile</h2>
            <label>Name:</label>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
            
            <label>Headline:</label>
            <input type="text" value={editHeadline} onChange={(e) => setEditHeadline(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />

            <label>Bio:</label>
            <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} style={{ width: '100%', minHeight: '100px', padding: '8px', marginBottom: '10px' }} />
            
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* --- USER'S POSTS FEED --- */}
      <div className="feed-container fade-in">
        <h2>{user.name}'s Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
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
            </div>
          ))
        ) : (
          <p>This user hasn't posted anything yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;