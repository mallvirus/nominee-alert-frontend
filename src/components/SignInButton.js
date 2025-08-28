import React from 'react';
import './SignInButton.css';

function SignInButton({ onClick, label = 'Sign in', className = '' }) {
  return (
    <button
      type="button"
      className={`sign-in-button ${className}`}
      onClick={onClick}
      aria-label={label}
    >
      <span className="sign-in-button__glow" aria-hidden="true" />
      <span className="sign-in-button__content">
        <svg
          className="sign-in-button__icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12c0 4.56 3.06 8.39 7.25 9.58.53.1.73-.23.73-.51 0-.25-.01-.92-.01-1.8-2.95.64-3.57-1.27-3.57-1.27-.48-1.22-1.17-1.54-1.17-1.54-.96-.65.07-.64.07-.64 1.06.07 1.62 1.09 1.62 1.09.94 1.61 2.46 1.15 3.06.88.1-.69.37-1.15.67-1.41-2.36-.27-4.85-1.18-4.85-5.27 0-1.17.42-2.12 1.09-2.86-.11-.27-.47-1.36.1-2.83 0 0 .89-.28 2.9 1.09.84-.24 1.74-.36 2.64-.36.9 0 1.81.12 2.64.36 2.01-1.37 2.9-1.09 2.9-1.09.57 1.47.21 2.56.1 2.83.68.74 1.09 1.69 1.09 2.86 0 4.1-2.49 4.99-4.86 5.26.38.33.71.97.71 1.96 0 1.41-.01 2.54-.01 2.88 0 .28.19.62.74.51C18.95 20.39 22 16.56 22 12c0-5.52-4.48-10-10-10z" fill="currentColor"/>
        </svg>
        <span className="sign-in-button__label">{label}</span>
      </span>
    </button>
  );
}

export default SignInButton;





