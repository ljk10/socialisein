import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password } = formData;

  // Your live backend URL
  const RENDER_URL = "https://socialisein-backend-ljk10.onrender.com";

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Use the full Render URL
    const url = isLogin
      ? `${RENDER_URL}/api/auth/login`
      : `${RENDER_URL}/api/auth/signup`;

    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      // ... in onSubmit function, inside the 'try' block
      const res = await axios.post(url, payload);

      localStorage.setItem('token', res.data.token);
      
      if (res.data.userId) {
        localStorage.setItem('userId', res.data.userId);
      }
      
      navigate('/');
// ...
    } catch (err) {
      // Set error message from backend response
      setError(
        err.response?.data?.msg || 'An error occurred. Please try again.'
      );
    }
  };

  return (
    <div className="auth-container fade-in">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          minLength="6"
          required
        />
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <p className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "Don't have an account? Sign Up"
          : 'Already have an account? Login'}
      </p>
    </div>
  );
};

export default AuthPage;