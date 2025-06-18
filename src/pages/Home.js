import React from 'react';
import './Home.css';
import { FaShieldAlt, FaUserCheck, FaLock, FaRocket, FaCheckCircle } from 'react-icons/fa';

const Home = ({ user }) => {
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
        <section className="user-info-section">
          <h2>Welcome, <span className="highlight">{user.name}</span> 👋</h2>
          <p>Email: <strong>{user.email}</strong></p>
        </section>
      )}
    </div>
  );
};

export default Home;