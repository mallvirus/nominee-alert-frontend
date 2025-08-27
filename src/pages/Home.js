import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './Home.css';
import Modal from 'react-modal';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import KeepMyAssetLogo from '../Image/Logo.png'
import { Helmet } from 'react-helmet';
import {
  FaTrash,
  FaPlus,
  FaInfoCircle,
  FaShieldAlt,
  FaUserCheck,
  FaLock,
  FaCheckCircle,
  FaBell,
  FaCloudUploadAlt,
  FaUsers,
  FaUniversity,
  FaFileInvoiceDollar,
  FaLandmark,
  FaExclamationTriangle,
  FaHeart,
  FaUserShield,
  FaClock,
  FaGlobe,
  FaDatabase,
  FaHeartBroken,
  FaEye,
  FaDownload,
  FaSpinner,
  FaCheckDouble,
  FaUserFriends,
  FaHandHoldingHeart,
  FaFamilyProtect,
  FaEdit
} from 'react-icons/fa';

Modal.setAppElement('#root');

const Home = ({ user, onGoogleSignIn , onNavigateApplicationOverview}) => {
  const [nominees, setNominees] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomineeEmail: '',
    nomineePhone: '',
    policyDocument: null,
    providerName: ''
  });
  const [editFormData, setEditFormData] = useState({
    nomineeId: null,
    policyId: null,
    nomineeEmail: '',
    nomineePhone: '',
    policyDocument: null,
    providerName: ''
  });
  const [errors, setErrors] = useState({ 
    nomineePhone: '', 
    policyDocument: '',
    nomineeEmail: '',
    providerName: ''
  });
  const [editErrors, setEditErrors] = useState({ 
    nomineePhone: '', 
    policyDocument: '',
    nomineeEmail: '',
    providerName: ''
  });

  // Animated counter hook
  const useAnimatedCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime;
      let animationFrame;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return count;
  };

  const fetchNominees = useCallback(async () => {
    
    if (user?.id) {
      const token = localStorage.getItem('token');
      setLoading(true);
      try {
       const response = await axios.get(
  `${process.env.REACT_APP_HOST_SERVER}/api/nominees/find/by/UserId?userId=${user.id}`,
  {
    timeout: 600000,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }
);
        setNominees(response.data.data || []);
      } catch (error) {
        console.error('Error fetching nominee data:', error);
        setNominees([]);
        if (error.code !== 'ECONNABORTED') {
          showNotification('Failed to load nominees. Please refresh the page.', 'error');
        }
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchNominees();
  }, [fetchNominees]);

  const handleRemove = async (nomineeId, policyId) => {
    const confirmMessage = `Are you sure you want to remove this nominee?\n\nThis action cannot be undone and the nominee will no longer have access to this policy information.`;
    const token= localStorage.getItem('token');

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await axios.delete(
        `${process.env.REACT_APP_HOST_SERVER}/api/nominees/${nomineeId}/policy/${policyId}`,
        { timeout: 10000, headers: {
      'Authorization': `Bearer ${token}`,
    } }
      );
      setNominees(nominees.filter(n => n.nomineeId !== nomineeId));
      showNotification('Nominee removed successfully! 🗑️', 'success');
    } catch (error) {
      console.error('Error removing nominee:', error);
      showNotification('Failed to remove nominee. Please try again.', 'error');
    }
  };

  const handleEditNominee = (nominee) => {
    setEditFormData({
      nomineeId: nominee.nomineeId,
      policyId: nominee.policyId,
      nomineeEmail: nominee.nomineeEmail,
      nomineePhone: nominee.nomineePhone,
      providerName: nominee.providerName,
      policyDocument: null // File input starts empty
    });
    setEditErrors({
      nomineePhone: '', 
      policyDocument: '',
      nomineeEmail: '',
      providerName: ''
    });
    setEditModalOpen(true);
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

    // Add animation keyframes if not already added
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 4000);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email address is required.';
    if (!emailRegex.test(email)) return 'Please enter a valid email address (e.g., john@example.com).';
    if (email.length > 100) return 'Email address must be less than 100 characters.';
    if (email.includes('..')) return 'Email address cannot contain consecutive dots.';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required.';
    if (!/^[0-9]{10}$/.test(phone)) return 'Phone number must be exactly 10 digits.';
    if (phone.startsWith('0')) return 'Phone number should not start with 0.';
    if (phone.startsWith('1')) return 'Phone number should not start with 1.';
    if (/^(.)\1{9}$/.test(phone)) return 'Phone number cannot have all same digits.';
    return '';
  };

  const validateFile = (file, isRequired = true) => {
    if (!file && isRequired) return 'Please select a document.';
    if (!file) return ''; // Optional file for edit

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 2 * 1024 * 1024; // 2MB limit
    const minSize = 1024; // 1KB minimum

    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF, JPG, and PNG files are allowed.';
    }

    if (file.size > maxSize) {
      return `File size must be less than 2MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    if (file.size < minSize) {
      return 'File seems too small. Please upload a valid document.';
    }

    return '';
  };

  const validateProviderName = (name) => {
    if (!name) return 'Provider name is required.';
    const trimmedName = name.trim();
    if (trimmedName.length < 2) return 'Provider name must be at least 2 characters.';
    if (trimmedName.length > 50) return 'Provider name must be less than 50 characters.';
    if (!/^[a-zA-Z0-9\s&.-]+$/.test(trimmedName)) {
      return 'Provider name can only contain letters, numbers, spaces, &, ., and -.';
    }
    return '';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (editErrors[field]) {
      setEditErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddNominee = async (e) => {
    e.preventDefault();
    const { nomineeEmail, nomineePhone, policyDocument, providerName } = formData;

    // Validate all fields with enhanced validation
    const emailError = validateEmail(nomineeEmail?.trim());
    const phoneError = validatePhone(nomineePhone?.trim());
    const docError = validateFile(policyDocument);
    const providerError = validateProviderName(providerName?.trim());
    const token= localStorage.getItem('token');

    setErrors({
      nomineeEmail: emailError,
      nomineePhone: phoneError,
      policyDocument: docError,
      providerName: providerError
    });

    // Check if any errors exist
    if (emailError || phoneError || docError || providerError) {
      showNotification('Please fix the errors in the form before submitting.', 'error');
      return;
    }

    setSubmitLoading(true);
    const payload = new FormData();
    payload.append('nomineeEmail', nomineeEmail.trim().toLowerCase());
    payload.append('nomineePhone', nomineePhone.trim());
    payload.append('providerName', providerName.trim());
    payload.append('userId', user.id);
    payload.append('policyDocument', policyDocument);

    try {
      await axios.post(
        `${process.env.REACT_APP_HOST_SERVER}/api/nominees/create/via/file`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          timeout: 30000, // 30 second timeout
        }
      );

      showNotification('🎉 Nominee added successfully! They will be notified when needed.', 'success');
      closeModal();
      fetchNominees();
    } catch (error) {
      console.error('Error adding nominee:', error);
      let errorMessage = 'Failed to add nominee. Please try again.';

      if (error.response?.status === 413) {
        errorMessage = 'File is too large. Please upload a file smaller than 2MB.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check all fields and try again.';
      } else if (error.response?.status === 409) {
        errorMessage = 'This nominee already exists for this policy.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout. Please check your connection and try again.';
      }

      showNotification(errorMessage, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdateNominee = async (e) => {
    e.preventDefault();
    const { nomineeId, policyId, nomineeEmail, nomineePhone, policyDocument, providerName } = editFormData;

    // Validate all fields (file is optional for edit)
    const emailError = validateEmail(nomineeEmail?.trim());
    const phoneError = validatePhone(nomineePhone?.trim());
    const docError = validateFile(policyDocument, false); // File is optional for edit
    const providerError = validateProviderName(providerName?.trim());

    setEditErrors({
      nomineeEmail: emailError,
      nomineePhone: phoneError,
      policyDocument: docError,
      providerName: providerError
    });

    // Check if any errors exist
    if (emailError || phoneError || docError || providerError) {
      showNotification('Please fix the errors in the form before submitting.', 'error');
      return;
    }

    setEditLoading(true);
    const payload = new FormData();
    payload.append('nomineeEmail', nomineeEmail.trim().toLowerCase());
    payload.append('nomineePhone', nomineePhone.trim());
    payload.append('providerName', providerName.trim());
    payload.append('userId', user.id);
    if (policyDocument) {
      payload.append('file', policyDocument);
    }

    try {
      const token =localStorage.getItem('token');
      const response = await axios.patch(
        `${process.env.REACT_APP_HOST_SERVER}/api/nominees/${nomineeId}/policy/${policyId}/update`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      if (response.data.successful) {
        showNotification('🎉 Nominee updated successfully!', 'success');
        closeEditModal();
        fetchNominees();
      }
    } catch (error) {
      console.error('Error updating nominee:', error);
      let errorMessage = 'Failed to update nominee. Please try again.';

      if (error.response?.status === 413) {
        errorMessage = 'File is too large. Please upload a file smaller than 2MB.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check all fields and try again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Nominee not found. Please refresh the page and try again.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout. Please check your connection and try again.';
      }

      showNotification(errorMessage, 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({ 
      nomineeEmail: '', 
      nomineePhone: '', 
      providerName: '', 
      policyDocument: null 
    });
    setErrors({ 
      nomineePhone: '', 
      policyDocument: '',
      nomineeEmail: '',
      providerName: ''
    });
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditFormData({
      nomineeId: null,
      policyId: null,
      nomineeEmail: '',
      nomineePhone: '',
      policyDocument: null,
      providerName: ''
    });
    setEditErrors({ 
      nomineePhone: '', 
      policyDocument: '',
      nomineeEmail: '',
      providerName: ''
    });
  };

  // Handle "Check If You're a Nominee" button click
  const handleCheckNomineeClick = () => {
    if (onGoogleSignIn) {
      onGoogleSignIn(); // Trigger Google Sign-In
    }
  };

  // Animated counters for statistics
  const bankAmount = useAnimatedCounter(35000);
  const insuranceAmount = useAnimatedCounter(27000);
  const govAmount = useAnimatedCounter(20000);

  // Landing page content for non-authenticated users
  if (!user) {
    return (
      <div className="home-layout">
        {/* Hero Section */}
        <section className="hero">
          {/* <div className="left-illustration">
          <img src={KeepMyAssetLogo} alt="Responsive Image" style={{ width: '500px', height: '350px' }}/>
          </div> */}
          <div className="hero-text">
            <h1>
              <span className="highlight">₹82,000 Crore</span> lies unclaimed in India
            </h1>
            <p className="tagline">Because nominees never knew they were nominees.</p>
            <p>
              Upload your policies, assign nominees, and rest assured they'll be informed 
              when it matters most. Don't let silence steal what your family deserves.
            </p>
            <div className="nominee-buttons">
            <button 
  className="nominee-btn view"
  onClick={()=>{
    console.log('Application Overview button clicked');
    onNavigateApplicationOverview()}} // call the prop function
>
  <FaEye />
  Application Overview
</button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <FaCloudUploadAlt className="step-icon" size={75} />
              <h3>1. Upload Documents</h3>
              <p>
                Securely store and organize your insurance documents in one encrypted place. 
                We support PDF, JPG, and PNG formats up to 2MB with bank-level security.
              </p>
            </div>
            <div className="step">
              <FaUserCheck className="step-icon"  size={75}/>
              <h3>2. Add Nominee Details</h3>
              <p>
                Specify nominee contact information and assign policies with complete privacy. 
                Add multiple nominees per policy with detailed verification.
              </p>
            </div>
            <div className="step">
              <FaBell className="step-icon" size={75}/>
              <h3>3. Automatic Notifications</h3>
              <p>
                In critical times, your nominees get notified automatically through secure 
                channels. No more lost policies or unaware beneficiaries.
              </p>
            </div>
          </div>
        </section>

        {/* The Unclaimed Truth Section */}
        <section className="data-section">
          <h2 className="section-title">The ₹82,000 Crore Truth No One Talks About</h2>
          <div className="data-content">
            <div className="data-card">
              <FaUniversity className="data-card-icon" size={45} />
              <h4>Bank Deposits & Savings</h4>
              <div className="amount">₹{bankAmount.toLocaleString()}+ Cr</div>
              <div className="reason">
                Inactive accounts and missing nominee information leave families completely unaware 
                of existing deposits and savings.
              </div>
            </div>
            <div className="data-card">
              <FaShieldAlt className="data-card-icon" size={45}/>
              <h4>Insurance Policies</h4>
              <div className="amount">₹{insuranceAmount.toLocaleString()}+ Cr</div>
              <div className="reason">
                Nominees remain unaware of policies or lack access to critical documents 
                and claim procedures.
              </div>
            </div>
            <div className="data-card">
              <FaLandmark className="data-card-icon" size={45}/>
              <h4>EPF, PPF & Government Schemes</h4>
              <div className="amount">₹{govAmount.toLocaleString()}+ Cr</div>
              <div className="reason">
                Families had no knowledge these investments existed, leading to permanent loss 
                of retirement funds.
              </div>
            </div>
          </div>
          <div className="callout">
            <FaExclamationTriangle style={{marginRight: '0.5rem'}} />
            One missed document. One unnotified nominee. ₹10L+ lost forever.
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2 className="section-title">Why People Trust Us</h2>
          <p className="trust-tagline">
            Join thousands of families who've secured their loved ones' financial future
          </p>
          <div className="features-grid">
            <div className="feature-box">
              <FaLock className="feature-icon" size={65} />
              <h4>Bank-Level Security</h4>
              <p>Your policies and personal information are protected with military-grade encryption, secure servers, and regular security audits.</p>
            </div>
            <div className="feature-box">
              <FaUserFriends className="feature-icon" size={65} />
              <h4>Multiple Nominees</h4>
              <p>Add and manage unlimited nominees per policy with customizable share percentages and detailed contact information.</p>
            </div>
            <div className="feature-box">
              <FaCheckCircle className="feature-icon" size={65}/>
              <h4>Smart Notifications</h4>
              <p>We notify your nominees through secure, verified channels when it matters most, ensuring they never miss out on their benefits.</p>
            </div>
            <div className="feature-box">
              <FaDatabase className="feature-icon" size={65}/>
              <h4>Zero Data Sharing</h4>
              <p>Your information is never sold or shared with third parties. Complete privacy and confidentiality guaranteed by design.</p>
            </div>
            <div className="feature-box">
              <FaBell className="feature-icon" size={65}/>
              <h4>Real-Time Updates</h4>
              <p>Instant notifications and updates ensure nominees are always informed about their beneficiary status and policy changes.</p>
            </div>
            <div className="feature-box">
              <FaGlobe className="feature-icon" size={65} />
              <h4>India-First Compliance</h4>
              <p>Built specifically for Indian insurance laws, regulatory requirements, and local banking systems with full compliance.</p>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="testimonial">
          <div className="testimonial-content">
            <h3>What If You Forgot to Tell Them?</h3>
            <div className="quote">
              When Rajiv passed away, his wife had no idea he had 2 policies worth ₹15 lakhs. 
              They expired unclaimed because no one knew they existed. Don't let silence steal 
              what your family deserves.
            </div>
            <div className="author">— Pooja Sharma, Delhi</div>
            <div className="testimonial-visual">
              <FaHeartBroken className="testimonial-icon" />
              <FaFileInvoiceDollar className="testimonial-icon" />
              <FaHandHoldingHeart className="testimonial-icon" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <h2>Protect Your Family in 2 Minutes</h2>
          <p>Simple, secure, and brings lifelong peace of mind to you and your loved ones.</p>
          <div className="cta-features">
            <div className="cta-feature">
              <FaClock className="cta-feature-icon" />
              <h4>Quick Setup</h4>
              <p>Get started in under 2 minutes with Google login</p>
            </div>
            <div className="cta-feature">
              <FaLock className="cta-feature-icon" />
              <h4>100% Secure</h4>
              <p>Bank-level encryption & complete privacy protection</p>
            </div>
            <div className="cta-feature">
              <FaHeart className="cta-feature-icon" />
              <h4>Peace of Mind</h4>
              <p>Your family will always know about their benefits</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Authenticated user dashboard
  return (
    <>
    <Helmet>
        <title>Home Page - keepmyasset</title>
        <meta name="description" content="This is the home page description for SEO." />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Home Page - keepmyasset" />
        <meta property="og:description" content="This is the home page description for SEO." />
        <meta property="og:url" content="https://www.keepmyasset.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Home Page - keepmyasset" />
        <meta name="twitter:description" content="This is the home page description for SEO." />
  </Helmet>
      <div className="home-layout">
      <section className="user-info-section">
        <div className="section-header">
          <h3>
            <FaUsers style={{color: '#2563eb'}} />
            Your Protected Nominees
          </h3>
          <button 
            className="add-icon-btn" 
            onClick={() => setModalOpen(true)}
            data-tooltip-id="tooltip-add" 
            data-tooltip-content="Add a new nominee to protect your family"
            disabled={loading}
          >
            <FaPlus className="add-icon" />
          </button>
          <ReactTooltip id="tooltip-add" />
        </div>

        {loading ? (
          <div style={{
            textAlign: 'center', 
            padding: '4rem 2rem',
            background: 'linear-gradient(145deg, #ffff 0%, #f8fafc 100%)',
            borderRadius: '1.5rem',
            marginTop: '2rem'
          }}>
            <FaSpinner style={{
              fontSize: '3rem',
              color: '#2563eb',
              animation: 'spin 1s linear infinite',
              marginBottom: '1.5rem'
            }} />
            <h4 style={{
              color: '#334155',
              marginBottom: '0.5rem',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>Loading Your Nominees...</h4>
            <p style={{color: '#64748b', fontSize: '1rem'}}>
              Fetching your protected family members
            </p>
          </div>
        ) : nominees.length > 0 ? (
          <div className="nominee-cards-container">
            {nominees.map((nominee, index) => (
              <div className="nominee-card" key={nominee.nomineeId} style={{
                animationDelay: `${index * 0.1}s`
              }}>
                <div className="card-actions">
                  <FaEdit
                    className="edit-icon"
                    title="Edit Nominee"
                    size={35}
                    onClick={() => handleEditNominee(nominee)}
                  />
                  <FaTrash
                    className="delete-icon"
                    onClick={() => handleRemove(nominee.nomineeId, nominee.policyId)}
                    size={35}
                    title="Remove Nominee"
                  />
                </div>
                <div className="nominee-info">
                  <div className="nominee-field">
                    <span className="label">
                      <FaCheckCircle style={{color: '#10b981', marginRight: '0.5rem'}} />
                      Email:
                    </span>
                    <span className="value">{nominee.nomineeEmail}</span>
                  </div>
                  <div className="nominee-field">
                    <span className="label">
                      <FaBell style={{color: '#f59e0b', marginRight: '0.5rem'}} />
                      Phone:
                    </span>
                    <span className="value">{nominee.nomineePhone}</span>
                  </div>
                  <div className="nominee-field">
                    <span className="label">
                      <FaShieldAlt style={{color: '#2563eb', marginRight: '0.5rem'}} />
                      Provider:
                    </span>
                    <span className="value">{nominee.providerName}</span>
                  </div>
                  <div className="nominee-field">
                    <span className="label">
                      <FaFileInvoiceDollar style={{color: '#8b5cf6', marginRight: '0.5rem'}} />
                      Document:
                    </span>
                    <a
                      className="document-link"
                      href={`${nominee.documentUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaDownload />
                      View Document
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaUserShield className="empty-state-icon" />
            <h4>Protect Your Family's Future Today</h4>
            <p>
              Start securing your loved ones by adding your first nominee. 
              It takes less than 2 minutes and provides lifelong peace of mind for your entire family.
            </p>
            <button 
              className="nominee-btn add"
              onClick={() => setModalOpen(true)}
              style={{marginTop: '1rem'}}
            >
              <FaPlus />
              Add Your First Nominee
            </button>

            <div className="empty-state-features">
              <div className="empty-state-feature">
                <FaLock className="empty-state-feature-icon" />
                <span>Bank-Level Security</span>
              </div>
              <div className="empty-state-feature">
                <FaBell className="empty-state-feature-icon" />
                <span>Smart Notifications</span>
              </div>
              <div className="empty-state-feature">
                <FaShieldAlt className="empty-state-feature-icon" />
                <span>Privacy Protected</span>
              </div>
              <div className="empty-state-feature">
                <FaClock className="empty-state-feature-icon" />
                <span>2-Minute Setup</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Add Nominee Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Add Nominee"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <h2>
            <FaUserCheck style={{color: '#2563eb'}} />
            Add New Nominee
          </h2>
          <form onSubmit={handleAddNominee} className="modal-form">
            <label>
              Nominee Email Address *
              <FaInfoCircle
                className="tooltip-icon"
                data-tooltip-id="tooltip-email"
                data-tooltip-content="Enter a valid email address for secure notifications and policy updates"
              />
              <input
                type="email"
                required
                placeholder="e.g. john.doe@example.com"
                className={errors.nomineeEmail ? 'input-error' : ''}
                value={formData.nomineeEmail}
                onChange={(e) => handleInputChange('nomineeEmail', e.target.value)}
                maxLength={100}
                disabled={submitLoading}
              />
              {errors.nomineeEmail && (
                <div className="error-message">
                  <FaExclamationTriangle />
                  {errors.nomineeEmail}
                </div>
              )}
            </label>

            <label>
              Phone Number *
              <FaInfoCircle
                className="tooltip-icon"
                data-tooltip-id="tooltip-phone"
                data-tooltip-content="10-digit Indian mobile number (without +91 or 0 prefix)"
              />
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                className={errors.nomineePhone ? 'input-error' : ''}
                value={formData.nomineePhone}
                onChange={(e) => handleInputChange('nomineePhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
                disabled={submitLoading}
              />
              {errors.nomineePhone && (
                <div className="error-message">
                  <FaExclamationTriangle />
                  {errors.nomineePhone}
                </div>
              )}
            </label>

            <label>
               Provider Name *
              <FaInfoCircle
                className="tooltip-icon"
                data-tooltip-id="tooltip-provider"
                data-tooltip-content="Name of your insurance company (e.g., LIC, HDFC Life, ICICI Prudential)"
              />
              <input
                type="text"
                required
                placeholder="e.g. LIC, HDFC Life, ICICI Prudential"
                className={errors.providerName ? 'input-error' : ''}
                value={formData.providerName}
                onChange={(e) => handleInputChange('providerName', e.target.value)}
                maxLength={50}
                disabled={submitLoading}
              />
              {errors.providerName && (
                <div className="error-message">
                  <FaExclamationTriangle />
                  {errors.providerName}
                </div>
              )}
            </label>

            <label>
              Document *
              <FaInfoCircle
                className="tooltip-icon"
                data-tooltip-id="tooltip-doc"
                data-tooltip-content="Upload PDF, JPG, or PNG file (maximum 2MB). Ensure document is clear and readable."
              />
              <label className="custom-file-upload">
                <input
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/jpg"
                  required
                  onChange={(e) => handleInputChange('policyDocument', e.target.files[0])}
                  disabled={submitLoading}
                />
                <FaCloudUploadAlt className="upload-icon" />
                {formData.policyDocument ? formData.policyDocument.name : 'Choose Document'}
              </label>
              {formData.policyDocument && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe'
                }}>
                  <FaFileInvoiceDollar style={{marginRight: '0.5rem'}} />
                  {formData.policyDocument.name} 
                  <span style={{color: '#64748b', marginLeft: '0.5rem'}}>
                    ({(formData.policyDocument.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
              {errors.policyDocument && (
                <div className="error-message">
                  <FaExclamationTriangle />
                  {errors.policyDocument}
                </div>
              )}
            </label>

            <div className="modal-buttons">
              <button 
                type="submit" 
                className="add-btn"
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Adding Nominee...
                  </>
                ) : (
                  <>
                    <FaCheckDouble />
                    Add Nominee
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={closeModal}
                disabled={submitLoading}
              >
                Cancel
              </button>
            </div>
          </form>

          <ReactTooltip id="tooltip-email" />
          <ReactTooltip id="tooltip-phone" />
          <ReactTooltip id="tooltip-doc" />
          <ReactTooltip id="tooltip-provider" />
        </Modal>

        {/* Edit Nominee Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          contentLabel="Edit Nominee"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <h2>
            <FaEdit style={{color: '#2563eb'}} />
            Edit Nominee
          </h2>
          <form onSubmit={handleUpdateNominee} className="modal-form">
            <label>
              Nominee Email Address *
              <FaInfoCircle
                className="tooltip-icon"
                data-tooltip-id="tooltip-edit-email"
                data-tooltip-content="Enter a valid email address for secure notifications and policy updates"
              />
              <input
                type="email"
                required
                placeholder="e.g. john.doe@example.com"
                className={editErrors.nomineeEmail ? 'input-error' : ''}
                value={editFormData.nomineeEmail}
                onChange={(e) => handleEditInputChange('nomineeEmail', e.target.value)}
                maxLength={100}
                disabled={editLoading}
              />
              {editErrors.nomineeEmail && (
                <div className="error-message">
                  <FaExclamationTriangle />
                  {editErrors.nomineeEmail}
                </div>
              )}
            </label>

            <label>
              Phone Number *
              <FaInfoCircle
                className="tooltip-icon"
                data-tooltip-id="tooltip-edit-phone"
                data-tooltip-content="10-digit Indian mobile number (without +91 or 0 prefix)"
              />
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                className={editErrors.nomineePhone ? 'input-error' : ''}
                value={editFormData.nomineePhone}
                onChange={(e) => handleEditInputChange('nomineePhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
                disabled={editLoading}
              />
              {editErrors.nomineePhone && (
                <div className="error-message">
                  <FaExclamationTriangle />
                  {editErrors.nomineePhone}
                </div>
              )}
            </label>

            <label>
              Provider Name *
              <FaInfoCircle
                className="tooltip-icon"
                data-tooltip-id="tooltip-edit-provider"
                data-tooltip-content="Name of your insurance company (e.g., LIC, HDFC Life, ICICI Prudential)"
              />
              <input
                type="text"
                required
                placeholder="e.g. LIC, HDFC Life, ICICI Prudential"
                className={editErrors.providerName ? 'input-error' : ''}
                value={editFormData.providerName}
                onChange={(e) => handleEditInputChange('providerName', e.target.value)}
                maxLength={50}
                disabled={editLoading}
              />
              {editErrors.providerName && (
                <div className="error-message">
                  <FaExclamationTriangle />
                  {editErrors.providerName}
                </div>
              )}
            </label>

            <label>
              Document (Optional - leave empty to keep current document)
              <FaInfoCircle
                className="tooltip-icon"
                data-tooltip-id="tooltip-edit-doc"
                data-tooltip-content="Upload PDF, JPG, or PNG file (maximum 2MB) to replace the current document. Leave empty to keep existing document."
              />
              <label className="custom-file-upload">
                <input
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/jpg"
                  onChange={(e) => handleEditInputChange('policyDocument', e.target.files[0])}
                  disabled={editLoading}
                />
                <FaCloudUploadAlt className="upload-icon" />
                {editFormData.policyDocument ? editFormData.policyDocument.name : 'Choose New Document (Optional)'}
              </label>
              {editFormData.policyDocument && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe'
                }}>
                  <FaFileInvoiceDollar style={{marginRight: '0.5rem'}} />
                  {editFormData.policyDocument.name} 
                  <span style={{color: '#64748b', marginLeft: '0.5rem'}}>
                    ({(editFormData.policyDocument.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
              {editErrors.policyDocument && (
                <div className="error-message">
                  <FaExclamationTriangle />
                  {editErrors.policyDocument}
                </div>
              )}
            </label>

            <div className="modal-buttons">
              <button 
                type="submit" 
                className="add-btn"
                disabled={editLoading}
              >
                {editLoading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Updating Nominee...
                  </>
                ) : (
                  <>
                    <FaCheckDouble />
                    Update Nominee
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={closeEditModal}
                disabled={editLoading}
              >
                Cancel
              </button>
            </div>
          </form>

          <ReactTooltip id="tooltip-edit-email" />
          <ReactTooltip id="tooltip-edit-phone" />
          <ReactTooltip id="tooltip-edit-doc" />
          <ReactTooltip id="tooltip-edit-provider" />
        </Modal>
      </section>
    </div>
    </>
    
  );
};

export default Home;