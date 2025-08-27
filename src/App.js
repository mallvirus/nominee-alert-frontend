import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaPhoneAlt, FaCheckCircle } from 'react-icons/fa';
import Header from './components/Header';
import Home from './pages/Home';
import NomineeCheckPage from './pages/NomineeCheckPage';
import './App.css';
import Footer from './components/Footer';
import ApplicationOverview from './pages/ApplicationOverview';
import { useLocation, useNavigate } from 'react-router-dom';

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // Existing logic unchanged
  const [loading, setLoading] = useState(true);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const extractUserPhone = (u) => {
    if (!u) return '';
    const candidates = [
      u.contact,
      u.phone,
      u.phoneNumber,
      u.mobile,
      u.mobileNumber
    ].filter(Boolean).map(String);
    for (const value of candidates) {
      const digits = value.replace(/\D/g, '').slice(-10);
      if (/^\d{10}$/.test(digits)) return digits;
    }
    return '';
  };

  const location = useLocation();
  const navigate = useNavigate();

  // Keep your navigation functions, but sync them with the browser URL as well
  const navigateToHome = () => {
    setCurrentPage('home');
    if (location.pathname !== "/") navigate("/");
  };
  const navigateToNomineeCheck = () => {
    setCurrentPage('nominee-check');
    if (location.pathname !== "/nominee-check") navigate("/nominee-check");
  };
  const navigateToApplicationOverview = () => {
    setCurrentPage('application-overview');
    if (location.pathname !== "/application-overview") navigate("/application-overview");
  };

  useEffect(() => {
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

  useEffect(() => {
    if (!user) return;
    const hasPhone = Boolean(extractUserPhone(user));
    const shownFlag = sessionStorage.getItem('phonePromptShown');
    if (!hasPhone && !shownFlag) {
      setPhoneInput('');
      setPhoneError('');
      setIsPhoneModalOpen(true);
      sessionStorage.setItem('phonePromptShown', '1');
    }
  }, [user]);

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

      const userInfo = { name: decoded.name, email: decoded.email, picture: decoded.picture };

      const res = await fetch(`${process.env.REACT_APP_HOST_SERVER}/api/user/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      });

      if (res.ok) {
        const data = await res.json();
        const userWithPicture = {
          ...data.user,
          picture: decoded.picture,
        };
        localStorage.setItem('user', JSON.stringify(userWithPicture));
        localStorage.setItem('token', data.token);
        setUser(userWithPicture);
        navigateToHome();
        const hasPhone = Boolean(extractUserPhone(userWithPicture));
        if (!hasPhone) {
          setPhoneInput('');
          setPhoneError('');
          setIsPhoneModalOpen(true);
          sessionStorage.setItem('phonePromptShown', '1');
        }
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
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    showNotification('You have been logged out successfully.', 'success');
  };

  const handleGoogleSignIn = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  };

  const showNotification = (message, type = 'success') => {
    // ...Keep your existing notification logic here...
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
    notification.autoRemoveTimer = autoRemoveTimer;
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required.';
    if (!/^\d{10}$/.test(phone)) return 'Phone number must be exactly 10 digits.';
    if (phone.startsWith('0') || phone.startsWith('1')) return 'Phone number should not start with 0 or 1.';
    return '';
  };

  const handleSavePhone = async () => {
    const trimmed = String(phoneInput || '').replace(/\D/g, '').slice(0, 10);
    const validationError = validatePhone(trimmed);
    setPhoneError(validationError);
    if (validationError) return;

    try {
      setSavingPhone(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_HOST_SERVER}/api/user/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId: user.id, contact: trimmed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update phone number');
      }

      const updatedUser = {
        ...user,
        contact: trimmed,
        phone: trimmed,
        phoneNumber: trimmed,
        mobile: trimmed,
        mobileNumber: trimmed,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsPhoneModalOpen(false);
      showNotification('Phone number updated successfully.', 'success');
    } catch (err) {
      setPhoneError('Could not save phone number. Please try again.');
    } finally {
      setSavingPhone(false);
    }
  };

  const handleClosePhoneModal = () => {
    setIsPhoneModalOpen(false);
  };

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

  // --- Minimal Routing for Privacy/Terms, normal for rest ---
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
        onNavigateApplicationOverview={navigateToApplicationOverview}
      />

      {/* Route-based rendering for Privacy/Terms */}
       (
        <main>
          {currentPage === 'home' && (
            <Home
              user={user}
              onGoogleSignIn={handleGoogleSignIn}
              onNavigateApplicationOverview={navigateToApplicationOverview}
            />
          )}
          {currentPage === 'nominee-check' && <NomineeCheckPage user={user} />}
          {currentPage === 'application-overview' && (
            <ApplicationOverview user={user} onLoginSuccess={navigateToHome} />
          )}
        </main>
      )

      <Modal
        isOpen={isPhoneModalOpen}
        onRequestClose={handleClosePhoneModal}
        contentLabel="Update Phone"
        overlayClassName="modal-overlay"
        className="modal"
        style={{
          overlay: {
            background: 'radial-gradient(1000px 500px at 20% 10%, rgba(37, 99, 235, 0.15), transparent) , rgba(2, 6, 23, 0.6)',
            zIndex: 10000,
            backdropFilter: 'blur(3px)'
          },
          content: {
            inset: 'auto',
            maxWidth: '480px',
            margin: '10vh auto',
            borderRadius: '18px',
            padding: '0',
            border: '1px solid rgba(148, 163, 184, 0.35)',
            boxShadow: '0 30px 80px rgba(2, 6, 23, 0.35)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,251,255,0.96) 100%)',
            overflow: 'hidden'
          }
        }}
      >
        <div style={{ padding: '1.25rem 1.25rem 1rem 1.25rem' }}>
          <button
            aria-label="Close"
            onClick={handleClosePhoneModal}
            style={{
              position: 'absolute',
              top: 10,
              right: 12,
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: 22,
              cursor: 'pointer'
            }}
          >
            ×
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginTop: 8 }}>
            <div style={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 45%, #c7d2fe 100%)',
              color: '#1e40af',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)'
            }}>
              <FaPhoneAlt />
            </div>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '1.6rem',
                lineHeight: 1.25,
                backgroundImage: 'linear-gradient(90deg, #0f172a, #0b3ea8, #2563eb)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}>Add your phone number</h2>
              <p style={{ color: '#475569', margin: '6px 0 0 0' }}>For faster notifications and payments, add a 10-digit mobile number.</p>
            </div>
          </div>

          <div style={{ marginTop: '1.1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: 600 }}>Mobile Number</label>
            <div style={{
              background: phoneError
                ? 'linear-gradient(135deg, #fecaca, #fca5a5)'
                : 'linear-gradient(135deg, #dbeafe, #c7d2fe)',
              padding: 2,
              borderRadius: 12
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'stretch',
                borderRadius: 10,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: phoneFocused ? '0 0 0 6px rgba(37, 99, 235, 0.12)' : 'none',
                transition: 'box-shadow 150ms ease'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 0.9rem',
                  background: '#f8fafc',
                  color: '#0f172a',
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  fontWeight: 700
                }}>+91</div>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhoneInput(v);
                    if (phoneError) setPhoneError(validatePhone(v));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !savingPhone) {
                      handleSavePhone();
                    }
                  }}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                  placeholder="9876543210"
                  maxLength={10}
                  style={{
                    width: '100%',
                    padding: '0.85rem 0.9rem',
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.6rem', gap: '0.4rem' }}>
              {phoneError ? (
                <span style={{ color: '#ef4444', fontSize: '0.92rem' }}>{phoneError}</span>
              ) : (
                <span style={{ color: '#64748b', fontSize: '0.92rem' }}>Enter a valid 10-digit Indian mobile number.</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a' }}>
              <FaCheckCircle />
              <div style={{ fontSize: '0.95rem' }}>
                <div>Used only for verification and alerts</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={handleClosePhoneModal}
                style={{
                  background: '#f8fafc',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  padding: '0.6rem 1rem',
                  borderRadius: 12,
                  cursor: 'pointer',
                  boxShadow: '0 1px 0 rgba(0,0,0,0.02)'
                }}
              >
                Not now
              </button>
              <button
                type="button"
                onClick={handleSavePhone}
                disabled={savingPhone}
                style={{
                  background: savingPhone
                    ? 'linear-gradient(90deg, #60a5fa, #3b82f6)'
                    : 'linear-gradient(90deg, #4338ca, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1rem',
                  borderRadius: 12,
                  cursor: savingPhone ? 'default' : 'pointer',
                  boxShadow: '0 12px 20px rgba(37, 99, 235, 0.25)'
                }}
              >
                {savingPhone ? 'Saving...' : 'Save number'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

export default App;
