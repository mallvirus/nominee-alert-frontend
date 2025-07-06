import React, { useState, useRef } from "react";
import {
  FaCloudUploadAlt,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaFileAlt,
  FaShieldAlt,
  FaUserCheck,
  FaBell,
  FaLock,
  FaCreditCard,
  FaCheckDouble,
  FaUsers,
  FaHandHoldingHeart,
  FaPhoneAlt,
  FaEnvelope,
  FaCertificate,
  FaRupeeSign,
  FaArrowRight,
  FaRedo,
  FaTimes
} from 'react-icons/fa';
import './NomineeCheckPage.css';

// Dummy user ID for demo; replace with your auth context/user state
const LOGGED_IN_USER_ID = "user_123456";

function NomineeCheckPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    file: ''
  });
  const fileInputRef = useRef();

  // Validation functions
 const validateEmail = (email) => {
  if (!email) return '';
  if (email.length > 50)
    return "Email can't exceed more than 50 characters";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address.';
  return '';
};

  const validatePhone = (phone) => {
    if (!phone) return '';
    if (!/^[0-9]{10}$/.test(phone)) return 'Phone number must be exactly 10 digits.';
    if (phone.startsWith('0') || phone.startsWith('1')) return 'Phone number should not start with 0 or 1.';
    return '';
  };

  const validateFile = (file) => {
    if (!file) return 'Please upload the death certificate.';
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF, JPG, and PNG files are allowed.';
    }
    if (file.size > maxSize) {
      return `File size must be less than 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }
    return '';
  };

  // Handle input changes with validation
  const handleEmailChange = (value) => {
    setEmail(value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePhoneChange = (value) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setPhone(numericValue);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: validatePhone(numericValue) }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setErrors(prev => ({ ...prev, file: validateFile(selectedFile) }));
      setToast({ type: "", message: "" });
    }
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setFile(null);
    setFileName("");
    setErrors(prev => ({ ...prev, file: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Simulate API call for upload & validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ type: "", message: "" });

    // Validate inputs
    const emailError = email ? validateEmail(email) : '';
    const phoneError = phone ? validatePhone(phone) : '';
    const fileError = validateFile(file);

    // Check if at least email or phone is provided
    if (!email.trim() && !phone.trim()) {
      setToast({ type: "error", message: "Please enter either Email or Phone Number." });
      return;
    }

    setErrors({
      email: emailError,
      phone: phoneError,
      file: fileError
    });

    if (emailError || phoneError || fileError) {
      setToast({ type: "error", message: "Please fix the errors in the form before submitting." });
      return;
    }

    setLoading(true);

    // Prepare form data
    const formData = new FormData();
    if (email) formData.append("policyHolderEmail", email);
    if (phone) formData.append("policyHolderPhoneNumber", phone);
    formData.append("deathCertificate", file);
    formData.append("LoggedInUserId", LOGGED_IN_USER_ID);

    try {
      // Simulate API response
      setTimeout(() => {
        setLoading(false);
        setToast({ type: "info", message: "Document verified successfully! Payment required to notify nominees." });
        setStep(2);
      }, 2000);
    } catch (err) {
      setLoading(false);
      setToast({ type: "error", message: "Upload failed. Please try again." });
    }
  };

  // Simulate Razorpay payment
  const handlePayment = () => {
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      setToast({ type: "success", message: "Payment successful! All nominees have been notified via SMS and Email." });
      setStep(3);
    }, 2500);
  };

  // Reset for new upload
  const handleReset = () => {
    setEmail("");
    setPhone("");
    setFile(null);
    setFileName("");
    setStep(1);
    setToast({ type: "", message: "" });
    setErrors({ email: '', phone: '', file: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="nominee-check-page">
      {/* Hero Section - Only show on step 1 */}
      {step === 1 && (
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              <FaHandHoldingHeart style={{marginRight: '1rem', color: '#fbbf24'}} />
              Document Verification Portal
            </h1>
            <p className="hero-description">
              Our secure platform enables quick verification of death certificates and instant notification 
              to all registered nominees, ensuring no family is left behind during difficult times.
            </p>
            
            <div className="hero-features">
              <div className="hero-feature">
                <FaShieldAlt className="hero-feature-icon" />
                <h4>Secure & Private</h4>
                <p>Bank-level encryption protects all sensitive documents and personal information</p>
              </div>
              <div className="hero-feature">
                <FaUserCheck className="hero-feature-icon" />
                <h4>Instant Verification</h4>
                <p>AI-powered document verification ensures authenticity within minutes</p>
              </div>
              <div className="hero-feature">
                <FaBell className="hero-feature-icon" />
                <h4>Multi-Channel Alerts</h4>
                <p>Nominees receive notifications via SMS, Email, and registered mail</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Form Section */}
      <section className="search-results">
        <div className="results-container">
          <div className="results-header">
            <h2>
              <FaCertificate style={{color: '#3b82f6'}} />
              Document Verification & Notification
            </h2>
            <div className="step-indicator">
              Step {step} of 3
            </div>
          </div>

          {/* Toast Notification */}
          {toast.message && (
            <div className={`toast-notification ${toast.type}`}>
              {toast.type === 'error' && <FaExclamationTriangle />}
              {toast.type === 'success' && <FaCheckCircle />}
              {toast.type === 'info' && <FaInfoCircle />}
              {toast.message}
            </div>
          )}

          {/* Step 1: Upload Form */}
          {step === 1 && (
            <div className="upload-form-container">
              <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-section">
                  <h3>
                    <FaUsers style={{color: '#3b82f6'}} />
                    Policyholder Information
                  </h3>

                  <div className="input-row">
                   <label>
  <FaEnvelope style={{color: '#3b82f6'}} />
  Email Address
</label>
<input
  type="email"
  value={email}
  onChange={(e) => handleEmailChange(e.target.value)}
  placeholder="e.g. john.doe@example.com"
  className={errors.email ? 'input-error' : ''}
  maxLength={50}
/>
{errors.email && <div className="error-message"><FaExclamationTriangle />{errors.email}</div>}

                    <div style={{
                      textAlign: 'center',
                      margin: '2rem 0',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '0',
                        right: '0',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #d1d5db, transparent)'
                      }}></div>
                      <span style={{
                        background: 'white',
                        padding: '0 2rem',
                        color: '#6b7280',
                        fontWeight: '600',
                        position: 'relative',
                        fontSize: '1.125rem'
                      }}>OR</span>
                    </div>

                    <label>
                      <FaPhoneAlt style={{color: '#3b82f6'}} />
                      Phone Number
                      <FaInfoCircle 
                        style={{color: '#9ca3af', fontSize: '1rem', cursor: 'help'}}
                        title="10-digit Indian mobile number (without +91 or 0 prefix)"
                      />
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className={errors.phone ? 'input-error' : ''}
                      maxLength={10}
                    />
                    {errors.phone && <div className="error-message"><FaExclamationTriangle />{errors.phone}</div>}
                  </div>
                </div>

                <div className="form-section">
                  <h3>
                    <FaCertificate style={{color: '#3b82f6'}} />
                    Death Certificate
                  </h3>

                  <div className="input-group">
                    <label>
                      <FaFileAlt style={{color: '#3b82f6'}} />
                      Upload Document *
                      <FaInfoCircle 
                        style={{color: '#9ca3af', fontSize: '1rem', cursor: 'help'}}
                        title="Upload PDF, JPG, or PNG file (maximum 5MB). Ensure document is clear and readable."
                      />
                    </label>

                    {!file && (
                      <label className="custom-file-upload">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                        <FaCloudUploadAlt style={{fontSize: '1.5rem'}} />
                        Choose Death Certificate
                      </label>
                    )}

                    {file && (
                      <div className="file-display-container">
                        <div className="file-info">
                          <FaFileAlt style={{fontSize: '1.5rem', color: '#1d4ed8'}} />
                          <div className="file-details">
                            <div className="file-name">{fileName}</div>
                            <div className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="remove-file-btn"
                          title="Remove file"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}

                    {errors.file && (
                      <div className="error-message">
                        <FaExclamationTriangle />
                        {errors.file}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn"
                >
                  {loading ? (
                    <>
                      <FaSpinner style={{animation: 'spin 1s linear infinite'}} />
                      Verifying Document...
                    </>
                  ) : (
                    <>
                      <FaCheckDouble />
                      Verify & Proceed
                      <FaArrowRight />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="payment-container">
              <div style={{marginBottom: '3rem'}}>
                <FaCreditCard style={{
                  fontSize: '5rem',
                  color: '#3b82f6',
                  marginBottom: '1.5rem'
                }} />
                <h3>Secure Payment Required</h3>
                <p>Complete the payment to notify all registered nominees</p>
              </div>

              <div className="payment-amount">
                <FaRupeeSign />
                Payment Amount: ₹2,000
              </div>

              <div className="payment-features">
                <div className="payment-feature">
                  <FaBell className="payment-feature-icon" style={{color: '#10b981'}} />
                  <h4>SMS Notifications</h4>
                  <p>Instant alerts to all nominees</p>
                </div>
                <div className="payment-feature">
                  <FaEnvelope className="payment-feature-icon" style={{color: '#3b82f6'}} />
                  <h4>Email Notifications</h4>
                  <p>Detailed claim information</p>
                </div>
                <div className="payment-feature">
                  <FaLock className="payment-feature-icon" style={{color: '#ef4444'}} />
                  <h4>Secure Process</h4>
                  <p>Bank-level encryption</p>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="submit-btn"
                style={{
                  maxWidth: '500px',
                  margin: '0 auto'
                }}
              >
                {paymentLoading ? (
                  <>
                    <FaSpinner style={{animation: 'spin 1s linear infinite'}} />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Pay ₹2,000 Securely
                    <FaArrowRight />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="success-container">
              <div className="success-message">
                <FaCheckCircle className="success-icon" />
                <h3>Payment Successful!</h3>
                <p>All registered nominees have been notified via SMS and Email about the policy claim.</p>
              </div>

              <div className="success-steps">
                <div className="step-card">
                  <FaBell className="step-icon" style={{color: '#10b981'}} />
                  <h4>SMS Sent</h4>
                  <p>Instant notifications delivered to all nominee phone numbers</p>
                </div>
                <div className="step-card">
                  <FaEnvelope className="step-icon" style={{color: '#3b82f6'}} />
                  <h4>Emails Delivered</h4>
                  <p>Detailed claim information sent to all nominee email addresses</p>
                </div>
                <div className="step-card">
                  <FaHandHoldingHeart className="step-icon" style={{color: '#f59e0b'}} />
                  <h4>Families Informed</h4>
                  <p>Beneficiaries can now proceed with their rightful claims</p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="submit-btn"
                style={{
                  width: 'auto',
                  display: 'inline-flex',
                  maxWidth: '400px',
                  margin: '0 auto'
                }}
              >
                <FaRedo />
                Process Another Certificate
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default NomineeCheckPage;