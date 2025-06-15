import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const handleGoogleResponse = async (response) => {
  // Decode the JWT (no external libraries needed)
  const base64Url = response.credential.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  const decoded = JSON.parse(jsonPayload);

  // Example user info
  const userInfo = {
    name: decoded.name,
    email: decoded.email
  };

  // Log user info (for now)
  console.log('User Info from Google:', userInfo);

  // Send to backend
  const res = await fetch('http://localhost:7001/api/user/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInfo),
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem('token', response.credential);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  } else {
    alert('Login failed');
  }
};


  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      return;
    }

    window.google?.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google?.accounts.id.renderButton(
      document.getElementById('google-button'),
      { theme: 'filled_blue', size: 'large', width: '300' }
    );

    window.google?.accounts.id.prompt();
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="app-container">
      {!user ? (
        <div className="login-container">
          <h1 className="title">Nominee Alert</h1>
          <p className="subtitle">Sign in to notify nominee on emergencies</p>
          <div id="google-button" className="google-button"></div>
        </div>
      ) : (
        <div className="user-container">
          <h2>Welcome, {user.name} 👋</h2>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <button onClick={logout} className="logout-button">Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
