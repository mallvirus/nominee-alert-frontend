import React from 'react';
import './Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="logo">🔔 Nominee Notify</div>
      {!user ? (
        <div id="google-button" />
      ) : (
        <button className="logout-button" onClick={onLogout}>Logout</button>
      )}
    </header>
  );
};

export default Header;