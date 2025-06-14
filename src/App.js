import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      return;
    }

    window.google?.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID', // 🔁 Replace this
      callback: handleGoogleResponse,
    });

    window.google?.accounts.id.renderButton(
      document.getElementById('google-button'),
      { theme: 'filled_blue', size: 'large', width: '300' }
    );

    window.google?.accounts.id.prompt();
  }, []);

  const handleGoogleResponse = async (response) => {
    const res = await fetch('http://localhost:8080/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    } else {
      alert('Login failed');
    }
  };

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
