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

      const userInfo = { name: decoded.name, email: decoded.email,picture: decoded.picture };

      const res = await fetch(`${process.env.REACT_APP_HOST_SERVER}/api/user/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      });

      if (res.ok) {
        const data = await res.json();
        const userWithPicture={
          ...data.user,
          picture:decoded.picture
        }
        localStorage.setItem('user', JSON.stringify(userWithPicture));
        setUser(userWithPicture);
      } else {
        console.error('Backend user creation failed:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Error handling Google response:', error);
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
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.app-notification');
    existingNotifications.forEach(notification => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    });

    const notification = document.createElement('div');
    notification.className = 'app-notification';
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    
    notification.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;width:100%;">
        <div style="display:flex;align-items:center;gap:0.75rem;flex:1;">
          <span style="font-size:1.25rem;">${icon}</span>
          <span style="flex:1;">${message}</span>
        </div>
        <button 
          onclick="this.parentElement.parentElement.remove()" 
          style="
            background:rgba(255,255,255,0.2);
            border:none;
            border-radius:50%;
            width:28px;
            height:28px;
            display:flex;
            align-items:center;
            justify-content:center;
            cursor:pointer;
            color:white;
            font-size:16px;
            font-weight:bold;
            transition:all 0.2s ease;
            flex-shrink:0;
          "
          onmouseover="this.style.background='rgba(255,255,255,0.3)';this.style.transform='scale(1.1)'"
          onmouseout="this.style.background='rgba(255,255,255,0.2)';this.style.transform='scale(1)'"
          title="Close notification"
        >×</button>
      </div>
    `;

    notification.style.cssText = `
      position:fixed;top:20px;right:20px;z-index:9999;
      background:${bgColor};color:white;padding:1rem 1.5rem;
      border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.2);
      font-weight:500;font-family:'Inter',sans-serif;
      animation:slideInRight 0.3s ease-out;
      max-width:400px;word-wrap:break-word;
      min-width:300px;
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
        .app-notification {
          transition: all 0.3s ease;
        }
        .app-notification:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.3) !important;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto-remove after 6 seconds (optional)
    const autoRemoveTimer = setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 6000);

    // Store timer reference to clear it if manually closed
    notification.autoRemoveTimer = autoRemoveTimer;
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