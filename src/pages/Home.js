import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { FaTrash } from 'react-icons/fa';
import { FaShieldAlt, FaUserCheck, FaLock, FaRocket, FaCheckCircle } from 'react-icons/fa';

const Home = ({ user }) => {
  const [nominees, setNominees] = useState([]);
  useEffect(() => {
  if (user?.id) {
    axios.get(`${process.env.REACT_APP_HOST_SERVER}/api/nominees/find/by/UserId?userId=${user.id}`)
      .then((response) => {
        setNominees(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching nominee data:', error);
      });
  }
}, [user]);

const handleRemove = async (nomineeId, policyId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_HOST_SERVER}/api/nominees/${nomineeId}/policy/${policyId}`);
      // Remove nominee from UI
      setNominees(nominees.filter(nominee => nominee.nomineeId !== nomineeId));
    } catch (error) {
      console.error("Error removing nominee:", error);
      alert("Failed to remove nominee. Please try again.");
    }
  };
  return (
    <div className="home-layout">
      {!user ? (
        <>
          <section className="hero">
            <div className="left-illustration">
              <img
                src="/insurance.svg"
                alt="Insurance Illustration"
                style={{ width: '160px', height: 'auto' }}
              />
            </div>
            <div className="hero-text">
              <h1><FaShieldAlt className="icon" /> Secure Your Nominees</h1>
              <p className="tagline">If you love them, don’t leave them guessing.</p>
              <p>
                Upload your policies, assign nominees, and rest assured they’ll be informed when it matters most.
              </p>
              <div className="login-wrap">
                <div id="google-button" className="google-login-btn" />
              </div>
               <div className="nominee-buttons">
                  <button className="nominee-btn view">View Nominee</button>
                  <button className="nominee-btn add">Add Nominee</button>
            </div>
            </div>
          </section>
          {/* How It Works */}
          <section className="how-it-works">
            <h2>How It Works</h2>
            <div className="steps">
              <div className="step">
                <FaShieldAlt className="step-icon" />
                <h3>Upload Policy</h3>
                <p>Store and organize your insurance documents in one place.</p>
              </div>
              <div className="step">
                <FaUserCheck className="step-icon" />
                <h3>Add Nominees</h3>
                <p>Specify nominee details and assign share percentages.</p>
              </div>
              <div className="step">
                <FaRocket className="step-icon" />
                <h3>We Handle It</h3>
                <p>In critical times, your nominees get notified automatically.</p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="features">
            <h2>Features You’ll Love</h2>
            <div className="features-grid">
              <div className="feature-box">
                <FaLock className="feature-icon" />
                <h4>Secure & Encrypted</h4>
                <p>Your policies and personal info are safely encrypted.</p>
              </div>
              <div className="feature-box">
                <FaUserCheck className="feature-icon" />
                <h4>Multiple Nominees</h4>
                <p>Add and manage multiple nominees per policy with ease.</p>
              </div>
              <div className="feature-box">
                <FaCheckCircle className="feature-icon" />
                <h4>Auto Notifications</h4>
                <p>We notify your nominees through secure channels.</p>
              </div>
            </div>
          </section>

          {/* Trust Section */}
          <section className="trust">
            <h2>Why People Trust Us</h2>
            <p className="trust-tagline">Built for transparency, backed by security. Trusted by families across India.</p>
            <div className="trust-highlights">
              <div>✅ Zero Data Sharing</div>
              <div>✅ Verified Platform</div>
              <div>✅ End-to-End Encryption</div>
              <div>✅ Real-Time Notifications</div>
              <div>✅ Secure Cloud Storage</div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta">
            <h2>Get Started in 2 Minutes</h2>
            <p>It’s simple, secure and built for peace of mind.</p>
            <div className="login-wrap">
              <div id="google-button" className="google-login-btn" />
            </div>
          </section>
        </>
      ) : (
        // <section className="user-info-section">
        //   <h2>Welcome, <span className="highlight">{user.name}</span> 👋</h2>
        //   <p>Email: <strong>{user.email}</strong></p>
        //   <p>UserId: <strong>{user.id}</strong></p>
        // </section>
 <section className="user-info-section">
  <h3>Your Nominees</h3>
  {nominees.length > 0 ? (
    <div className="nominee-cards-container">
      {nominees.map((nominee) => (
        <div className="nominee-card" key={nominee.nomineeId}>
  <FaTrash
    className="delete-icon"
    onClick={() => handleRemove(nominee.nomineeId, nominee.policyId)}
    title="Delete Nominee"
  />
  <div className="nominee-info">
    <div className="nominee-field">
      <span className="label">Email:</span>
      <span className="value">{nominee.nomineeEmail}</span>
    </div>
    <div className="nominee-field">
      <span className="label">Phone:</span>
      <span className="value">{nominee.nomineePhone}</span>
    </div>
    <div className="nominee-field">
      <span className="label">Document:</span>
      <a
        className="document-link"
        href={`http://localhost:8080/${nominee.documentUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Document
      </a>
    </div>
  </div>
</div>

      ))}
    </div>
  ) : (
    <p>No nominees found.</p>
  )}
</section>
      )}
    </div>
  );
};

export default Home;