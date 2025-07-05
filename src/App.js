import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import NomineeCheckPage from './pages/NomineeCheckPage';
import './App.css';
import Footer from './components/Footer';

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'nominee-check'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage or sessionStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleGoogleResponse = (response) => {
    try {
      // Decode the JWT token to get user information
      const token = response.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );

      const userData = JSON.parse(jsonPayload);

      const userInfo = {
        id: userData.sub,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        token,
      };

      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));

      // Navigate to nominee check page after successful sign‑in
      setCurrentPage('nominee-check');

      showNotification(`Welcome ${userData.name}! 🎉`, 'success');
    } catch (error) {
      console.error('Error processing Google response:', error);
      showNotification('Sign‑in failed. Please try again.', 'error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage('home');

    // Sign out from Google
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }

    showNotification('You have been logged out successfully.', 'success');
  };

  const handleGoogleSignIn = () => {
    // This function will be called when user clicks "Check If You're a Nominee"
    // The actual sign-in is handled by the Google button in the Header component
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.5rem;">
        ${type === 'success' ? '✅' : '❌'}
        <span>${message}</span>
      </div>
    `;

    const bgColor = type === 'success' ? '#10b981' : '#ef4444';
    notification.style.cssText = `
      position:fixed;top:20px;right:20px;z-index:9999;
      background:${bgColor};color:white;padding:1rem 1.5rem;
      border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.2);
      font-weight:500;font-family:'Inter',sans-serif;
      animation:slideInRight 0.3s ease-out,fadeOut 0.3s ease-in 3.7s;
      max-width:400px;word-wrap:break-word;
    `;

    // Add animation keyframes if not already added
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 4000);
  };

  const navigateToHome = () => setCurrentPage('home');
  const navigateToNomineeCheck = () => setCurrentPage('nominee-check');

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg,#f8fafc 0%,#e0f2fe 100%)',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ color: '#64748b', fontSize: '1.125rem', fontWeight: 500 }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header
        user={user}
        onLogout={handleLogout}
        onGoogleResponse={handleGoogleResponse}
        googleClientId={GOOGLE_CLIENT_ID}
        onNavigateHome={navigateToHome}
        onNavigateNomineeCheck={navigateToNomineeCheck}
        currentPage={currentPage}
      />

      <main>
        {currentPage === 'home' && (
          <Home user={user} onGoogleSignIn={handleGoogleSignIn} />
        )}
        {currentPage === 'nominee-check' && <NomineeCheckPage user={user} />}
        
      </main>
      <Footer />
    </div>
  );
}

export default App;

