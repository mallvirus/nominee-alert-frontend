import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaSearch,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaDownload,
  FaShieldAlt,
  FaBell,
  FaUserCheck,
  FaInfoCircle,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaCalendarAlt,
  FaEye,
  FaUserShield,
  FaHeart,
  FaLock,
  FaClock
} from 'react-icons/fa';

const NomineeCheckPage = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [nominations, setNominations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  // Auto-search when component mounts and user is available
  useEffect(() => {
    if (user?.email && !hasSearched) {
      searchNominations();
    }
  }, [user]);

  const searchNominations = async () => {
    if (!user?.email) {
      setError('User email not available. Please try signing in again.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Search for nominations where the user's email matches nominee email
      const response = await axios.get(
        `${process.env.REACT_APP_HOST_SERVER}/api/nominees/search/by/email?email=${encodeURIComponent(user.email)}`,
        { timeout: 10000 }
      );
      
      setNominations(response.data.data || []);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching nominations:', error);
      setError('Failed to search for nominations. Please try again.');
      setNominations([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        ${type === 'success' ? '✅' : '❌'}
        <span>${message}</span>
      </div>
    `;

    const bgColor = type === 'success' ? '#10b981' : '#ef4444';
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 9999;
      background: ${bgColor}; color: white; padding: 1rem 1.5rem;
      border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      font-weight: 500; font-family: 'Inter', sans-serif;
      animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-in 3.7s;
      max-width: 400px; word-wrap: break-word;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 4000);
  };

  const handleDownloadDocument = (documentUrl, providerName) => {
    try {
      const link = document.createElement('a');
      link.href = `${process.env.REACT_APP_HOST_SERVER}/${documentUrl}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
      
      showNotification(`Opening ${providerName} policy document...`, 'success');
    } catch (error) {
      showNotification('Failed to open document. Please try again.', 'error');
    }
  };

  return (
    <div className="nominee-check-page">
      {/* Hero Section */}
      <section className="check-hero">
        <div className="check-hero-content">
          <div className="welcome-message">
            <FaUserCheck className="welcome-icon" />
            <h1>Welcome, {user?.name || 'User'}!</h1>
            <p>Let's check if you're listed as a nominee in any policies</p>
          </div>
          
          <div className="search-info">
            <FaInfoCircle className="info-icon" />
            <p>We're searching for policies where your email <strong>{user?.email}</strong> is listed as a nominee.</p>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      <section className="search-results">
        <div className="results-header">
          <h2>
            <FaSearch style={{color: '#2563eb'}} />
            Your Nominee Status
          </h2>
          
          {!loading && !hasSearched && (
            <button 
              className="search-btn"
              onClick={searchNominations}
              disabled={loading}
            >
              <FaSearch />
              Search Now
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-state">
            <FaSpinner className="loading-spinner" />
            <h3>Searching for your nominations...</h3>
            <p>Please wait while we check all registered policies</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <FaExclamationTriangle className="error-icon" />
            <h3>Search Error</h3>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={searchNominations}
            >
              <FaSearch />
              Try Again
            </button>
          </div>
        ) : hasSearched ? (
          nominations.length > 0 ? (
            <div className="nominations-found">
              <div className="success-message">
                <FaCheckCircle className="success-icon" />
                <h3>Great News! You're a Nominee</h3>
                <p>We found {nominations.length} {nominations.length === 1 ? 'policy' : 'policies'} where you're listed as a nominee.</p>
              </div>

              <div className="nominations-grid">
                {nominations.map((nomination, index) => (
                  <div key={`${nomination.policyId}-${index}`} className="nomination-card">
                    <div className="card-header">
                      <FaShieldAlt className="policy-icon" />
                      <div className="policy-info">
                        <h4>{nomination.providerName}</h4>
                        <span className="policy-id">Policy ID: {nomination.policyId}</span>
                      </div>
                    </div>

                    <div className="nomination-details">
                      <div className="detail-row">
                        <FaEnvelope className="detail-icon" />
                        <span className="detail-label">Your Email:</span>
                        <span className="detail-value">{nomination.nomineeEmail}</span>
                      </div>
                      
                      <div className="detail-row">
                        <FaPhone className="detail-icon" />
                        <span className="detail-label">Your Phone:</span>
                        <span className="detail-value">{nomination.nomineePhone}</span>
                      </div>
                      
                      <div className="detail-row">
                        <FaBuilding className="detail-icon" />
                        <span className="detail-label">Insurance Provider:</span>
                        <span className="detail-value">{nomination.providerName}</span>
                      </div>

                      {nomination.createdAt && (
                        <div className="detail-row">
                          <FaCalendarAlt className="detail-icon" />
                          <span className="detail-label">Added On:</span>
                          <span className="detail-value">
                            {new Date(nomination.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {nomination.documentUrl && (
                      <div className="document-section">
                        <button 
                          className="document-btn"
                          onClick={() => handleDownloadDocument(nomination.documentUrl, nomination.providerName)}
                        >
                          <FaFileInvoiceDollar />
                          <span>View Policy Document</span>
                          <FaDownload />
                        </button>
                      </div>
                    )}

                    <div className="card-footer">
                      <div className="status-badge">
                        <FaCheckCircle />
                        <span>Active Nominee</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="next-steps">
                <h3>What This Means for You</h3>
                <div className="steps-grid">
                  <div className="step-card">
                    <FaBell className="step-icon" />
                    <h4>Stay Informed</h4>
                    <p>You'll be notified about important policy updates and claim procedures when needed.</p>
                  </div>
                  <div className="step-card">
                    <FaLock className="step-icon" />
                    <h4>Secure Access</h4>
                    <p>Your nomination details are securely stored and will be accessible when required.</p>
                  </div>
                  <div className="step-card">
                    <FaUserShield className="step-icon" />
                    <h4>Protected Rights</h4>
                    <p>Your rights as a nominee are protected and documented in the system.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-nominations">
              <div className="no-results-icon">
                <FaEye />
              </div>
              <h3>No Nominations Found</h3>
              <p>We couldn't find any policies where your email <strong>{user?.email}</strong> is listed as a nominee.</p>
              
              <div className="suggestions">
                <h4>This could mean:</h4>
                <ul>
                  <li>You might not be nominated in any policies yet</li>
                  <li>The policy holder might have used a different email address</li>
                  <li>The policies might not be registered in our system</li>
                </ul>
              </div>

              <div className="action-suggestions">
                <h4>What you can do:</h4>
                <div className="suggestion-cards">
                  <div className="suggestion-card">
                    <FaHeart className="suggestion-icon" />
                    <h5>Contact Family Members</h5>
                    <p>Ask your family members if they've nominated you in their insurance policies</p>
                  </div>
                  <div className="suggestion-card">
                    <FaShieldAlt className="suggestion-icon" />
                    <h5>Encourage Registration</h5>
                    <p>Share this platform with family members to help them register their policies</p>
                  </div>
                  <div className="suggestion-card">
                    <FaClock className="suggestion-icon" />
                    <h5>Check Back Later</h5>
                    <p>New policies are added regularly. Check back periodically for updates</p>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : null}
      </section>
    </div>
  );
};

export default NomineeCheckPage;