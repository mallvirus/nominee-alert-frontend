// App.js
import React, { useEffect, useState } from 'react';
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

  const handleGoogleResponse = async (response) => {
    if (!response.credential) {
      console.error('Google sign-in failed: No credential received.');
      return;
    }

    try {
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
        console.log('User signed in:', data.user);
      } else {
        console.error('Backend user creation failed:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Error handling Google response:', error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.clear();
      }
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    console.log('User logged out.');
  };

  return (
    <Router>
      <div className="app-wrapper">
        <Header
          user={user}
          onLogout={logout}
          onGoogleResponse={handleGoogleResponse}
          googleClientId={GOOGLE_CLIENT_ID}
        />

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