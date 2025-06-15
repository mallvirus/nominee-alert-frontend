import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import { FaWeight } from 'react-icons/fa';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      return;
    }

    window.google?.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

      window.google?.accounts.id.renderButton(
      document.getElementById('google-button'),
      {
       theme: 'filled_blue',
    size: 'large',
    width: 100,
    text: 'signin',  
    shape: 'pill',
      }
    );
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <div className="app-wrapper">
      <Header user={user} onLogout={logout} />
      <Home user={user} />
    </div>
  );
}

export default App;