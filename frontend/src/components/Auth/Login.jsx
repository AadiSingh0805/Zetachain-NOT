import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setUserData(null);

    try {
      console.log('Sending login request:', { email, password }); // Debugging

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Login successful! You are logged in as a ${data.role}.`);
        setUserData(data.data); // Store user-specific data
        navigate('/home');
      } else {
        setMessage(`Login failed: ${data.error}`);
      }
    } catch (error) {
      setMessage(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>
      <div className="auth-content">
        <div className="auth-form-container">
          <div className="auth-header">
            <h1 className="auth-logo">ZetaBeats</h1>
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>
          
          <form className="auth-form" onSubmit={handleLogin}>
            {message && <div className="auth-message">{message}</div>}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link></p>
            <Link to="/" className="auth-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;