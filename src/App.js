import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [user, setUser] = useState(null);
  const googleButtonRef = useRef(null); // ✅ Reference for the Google Sign-In button

  const handleGoogleResponse = async (response) => {
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);

    const userInfo = { name: decoded.name, email: decoded.email };

    const res = await fetch('http://localhost:7001/api/user/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    }
  };

  // ✅ Show Google button when no user
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      return;
    }

    if (!user && window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'filled_blue',
        size: 'large',
        width: 100,
        text: 'signin',
        shape: 'pill',
      });
    }
  }, [user]);

  const logout = () => {
    localStorage.clear();
    setUser(null); // ✅ This will trigger useEffect to re-render Google button
  };

  return (
    <Router>
      <div className="app-wrapper">
        <Header user={user} onLogout={logout} />

        {/* 👇 Conditionally render Google Sign-In button */}
        {!user && (
          <div style={{ textAlign: 'right', margin: '1rem' }}>
            <div ref={googleButtonRef} id="google-button"></div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
