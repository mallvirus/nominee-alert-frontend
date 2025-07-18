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
    // This effect runs once when the component mounts
    // to initialize the Google button if conditions are met.
    if (window.google && googleClientId && !isGoogleInitialized.current) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: onGoogleResponse,
      });

      // Render the button into the specific div by its ID
      // This div will be always present in the Header's JSX.
      const googleButtonElement = document.getElementById(GOOGLE_BUTTON_ID);
      if (googleButtonElement) {
        window.google.accounts.id.renderButton(googleButtonElement, {
          theme: 'filled_blue',
          size: 'large',
          width: 100, // Make sure width is sufficient
          text: 'signin',
          shape: 'pill',
        });
        isGoogleInitialized.current = true; // Mark as initialized
      } else {
        console.error(`Element with ID ${GOOGLE_BUTTON_ID} not found.`);
      }
    }
  }, [googleClientId, onGoogleResponse]); // Dependencies for initial setup

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
            <meta property="og:url" content="https://keepmyasset.com" />
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