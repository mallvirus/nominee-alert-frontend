import React, { useEffect, useRef } from 'react';
import './Header.css';
import KeepMyAssetLogo from './KeepMyAssetLogo';
import { Helmet } from 'react-helmet';

// ID for the Google button container. It MUST be unique.
// This ID will be used by the Google library to find the element.
const GOOGLE_BUTTON_ID = 'google-sign-in-button-container';

const Header = ({ 
  user, 
  onLogout, 
  onGoogleResponse, 
  googleClientId, 
  onNavigateHome, 
  onNavigateNomineeCheck, 
  currentPage 
}) => {
  // We no longer need a ref if we're targeting by ID after initial render.
  // However, it's still useful to make sure the div is in the DOM when we initialize.
  const isGoogleInitialized = useRef(false); // To prevent multiple initializations
  useEffect(() => {
    // Initialize Google One Tap / button when script is ready.
    const initializeGoogleButton = () => {
      if (!window.google || !googleClientId || isGoogleInitialized.current) return false;
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: onGoogleResponse,
        });
        const googleButtonElement = document.getElementById(GOOGLE_BUTTON_ID);
        if (googleButtonElement) {
          window.google.accounts.id.renderButton(googleButtonElement, {
            theme: 'filled_blue',
            size: 'large',
            width: 100,
            text: 'signin',
            shape: 'pill',
          });
          isGoogleInitialized.current = true;
          return true;
        } else {
          console.error(`Element with ID ${GOOGLE_BUTTON_ID} not found.`);
        }
      } catch (err) {
        console.error('Failed to initialize Google Sign-In:', err);
      }
      return false;
    };

    // Try immediately in case the script is already available.
    if (initializeGoogleButton()) return;

    // Attach a load listener to the Google script tag as a primary signal.
    const script = document.querySelector('script[src^="https://accounts.google.com/gsi/client"]');
    const onScriptLoad = () => {
      initializeGoogleButton();
    };
    if (script) {
      script.addEventListener('load', onScriptLoad);
    }

    // Poll as a safety net for environments where the load event was missed.
    const startTime = Date.now();
    const pollIntervalId = window.setInterval(() => {
      if (isGoogleInitialized.current) {
        window.clearInterval(pollIntervalId);
        return;
      }
      if (Date.now() - startTime > 7000) {
        window.clearInterval(pollIntervalId);
        return;
      }
      initializeGoogleButton();
    }, 200);

    return () => {
      if (script) script.removeEventListener('load', onScriptLoad);
      window.clearInterval(pollIntervalId);
    };
  }, [googleClientId, onGoogleResponse]); // Dependencies for setup/retry

  useEffect(() => {
    // This effect runs whenever the `user` state changes.
    // It controls the visibility of the Google button.
    const googleButtonElement = document.getElementById(GOOGLE_BUTTON_ID);
    if (googleButtonElement) {
      if (user) {
        // If user is logged in, hide the button
        googleButtonElement.style.display = 'none';
        // Also hide any One Tap prompts if they are active
        if (window.google && window.google.accounts) {
          window.google.accounts.id.cancel();
        }
      } else {
        // If no user, show the button
        googleButtonElement.style.display = 'block'; // Or 'flex', 'inline-block' depending on container
        // Optionally prompt for One Tap sign-in
        if (window.google && window.google.accounts) {
          window.google.accounts.id.prompt();
        }
      }
    }
  }, [user]); // Only re-run when the 'user' prop changes

  return (
    <>
    <Helmet>
            <title>Header - keepmyasset</title>
            <meta name="description" content="Header with keepmyasset" />
    
            {/* Open Graph */}
            <meta property="og:title" content="Header - keepmyasset" />
            <meta property="og:description" content="Header with keepmyasset." />
            <meta property="og:url" content="https://www.keepmyasset.com" />
            <meta property="og:type" content="website" />
    
            {/* Twitter Card */}
            <meta name="twitter:title" content="Header - keepmyasset" />
            <meta name="twitter:description" content="Header with keepmyasset." />
    </Helmet>
    <header className="header">
     <div onClick={onNavigateHome} style={{ cursor: 'pointer' }}>
  <KeepMyAssetLogo />
</div>
      
      {/* Navigation Menu for authenticated users */}
      {user && (
        <nav className="header-nav">
          <button 
            className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
            onClick={onNavigateHome}
          >
            Dashboard
          </button>
          <button 
            className={`nav-btn ${currentPage === 'nominee-check' ? 'active' : ''}`}
            onClick={onNavigateNomineeCheck}
          >
            Check Nominations
          </button>
        </nav>
      )}
      
      <div className="auth-section"> {/* Wrapper for authentication elements */}
        {/* The Google button container is ALWAYS rendered in the DOM,
            but its visibility is controlled by CSS 'display' property
            in the useEffect hook based on the 'user' state. */}
        <div id={GOOGLE_BUTTON_ID} className="google-button-wrapper"></div>

        {/* This section is conditionally rendered by React based on the 'user' prop */}
        {user && ( // Only render this if a user is logged in
          <div className="user-info-container">
            {user.picture && (
              <img 
                src={user.picture} 
                alt={user.name}
                className="user-avatar"
              />
            )}
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
            <span onClick={onLogout} className="logout-link">
              Logout
            </span>
          </div>
        )}
      </div>
    </header>
    </>
  );
};

export default Header;