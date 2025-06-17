import React from 'react';
import './Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="logo">🔔 Nominee Notify</div>
      {!user ? (
  <div id="google-button"></div>
) : (
  <div style={{ textAlign: 'center', margin: '1rem' }}>
    <div>{user.name}</div>
    <span onClick={onLogout} className="logout-link">Logout</span>
  </div>
)}
    </header>
  );
};

export default Header;