import React, { useState, useRef, useEffect } from "react";
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
import axios from 'axios';
import Modal from 'react-modal';
import { loadRazorpayScript } from '../utils/loadRazorpay';
import './NomineeCheckPage.css';
import { Helmet } from 'react-helmet';

Modal.setAppElement('#root');

function NomineeCheckPage({ user }) {
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
  const toastRef = useRef();
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [secureFetchLoading, setSecureFetchLoading] = useState(false);
  const [showSecureConfirm, setShowSecureConfirm] = useState(false);

  const baseAmountInPaise = 200000; // ₹2000
  const secureAmountInPaise = 2000000; // ₹20000
  const effectiveAmountInPaise = isSecureMode ? secureAmountInPaise : baseAmountInPaise;

  // Focus toast on message change for accessibility
  useEffect(() => {
    if (toast.message && toastRef.current) {
      toastRef.current.focus();
    }
  }, [toast]);

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

  // Input handlers with validation
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

  const handleRemoveFile = () => {
    setFile(null);
    setFileName("");
    setErrors(prev => ({ ...prev, file: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Lookup secure mode for the policyholder being validated using email/phone
  const checkSecureModeForIdentifier = async () => {
    const token = localStorage.getItem('token');
    try {
      setSecureFetchLoading(true);
      const params = new URLSearchParams();
      if (email) params.append('email', email);
      if (phone) params.append('phoneNumber', phone);
      const url = `${process.env.REACT_APP_HOST_SERVER}/api/user/secure-mode/lookup${params.toString() ? `?${params.toString()}` : ''}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (!resp.ok) throw new Error('Lookup failed');
      const json = await resp.json();
      const raw =
        (json && (json.isSecure ?? json.secure)) ??
        (json?.data && (json.data.isSecure ?? json.data.secure));
      const value = raw === true || raw === false ? raw : String(raw).toLowerCase() === 'true';
      setIsSecureMode(Boolean(value));
      if (Boolean(value)) setShowSecureConfirm(true);
    } catch (e) {
      console.error('Secure-mode lookup error:', e);
    } finally {
      setSecureFetchLoading(false);
    }
  };

  // Form submit handler for validation API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ type: "", message: "" });

    const emailError = email ? validateEmail(email) : '';
    const phoneError = phone ? validatePhone(phone) : '';
    const fileError = validateFile(file);

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

    const formData = new FormData();
    if (email) formData.append("email", email);
    if (phone) formData.append("phoneNumber", phone);
    if (file) formData.append("policyDocument", file);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${process.env.REACT_APP_HOST_SERVER}/api/policies/policyholders/validate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (data.successful === true && data.message === "User/Nominee Found") {
        setToast({ type: "success", message: "User/Nominee Found. Proceeding..." });
        setStep(2);
        // Immediately check secure-mode for this identifier
        checkSecureModeForIdentifier();
      } else {
        setToast({ type: "error", message: data.message || "Validation failed. Please check your details." });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error calling validation API. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Razorpay payment handler
  const handlePayment = async (amountPaise) => {
    const token = localStorage.getItem('token');
    setPaymentLoading(true);
    setToast({ type: '', message: '' });

    const res = await loadRazorpayScript();
    if (!res) {
      setToast({ type: 'error', message: 'Failed to load Razorpay SDK. Please check your internet connection.' });
      setPaymentLoading(false);
      return;
    }

    try {
      const createOrderResponse = await fetch(`${process.env.REACT_APP_HOST_SERVER}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
         },
        body: JSON.stringify({
          userId: user.id,
          serviceType: 'nominee_check',
          pickupDate: new Date().toISOString(),
          amount: amountPaise,
        }),
      });

      if (!createOrderResponse.ok) {
        const errorText = await createOrderResponse.text();
        setToast({ type: 'error', message: 'Order creation failed: ' + errorText });
        setPaymentLoading(false);
        return;
      }

      const responseData = await createOrderResponse.json();

      const razorpayOrderId = responseData?.data?.razorpayOrderId;
      const currency = responseData?.data?.currency;
      const amount = responseData?.data?.amount;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount,
        currency,
        name: 'KeepMyAsset',
        description: 'Nominee Check Payment',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(`${process.env.REACT_APP_HOST_SERVER}/api/orders/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
               },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              setToast({ type: 'success', message: 'Payment successful and verified!' });
              setStep(3);
              try {
    const emailRequestBody = {
      emailId: email || null,
      phoneNumber: phone || null,
    };

    const sendResponse = await fetch(`${process.env.REACT_APP_HOST_SERVER}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
       },
      body: JSON.stringify(emailRequestBody),
    });

    if (sendResponse.ok) {
      // Optionally show success toast or log
      console.log('Notification sent successfully');
    } else {
      console.error('Failed to send notification');
      // Optionally show error toast
      setToast(prev => ({
        type: 'error',
        message: 'Payment verified but failed to send notification.'
      }));
    }
  } catch (err) {
    console.error('Error sending notification:', err);
    setToast(prev => ({
      type: 'error',
      message: 'Payment verified but error occurred sending notification.'
    }));
  }
            } else {
              setToast({ type: 'error', message: 'Payment verification failed.' });
            }
          } catch (err) {
            setToast({ type: 'error', message: 'Error verifying payment.' });
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setToast({ type: 'info', message: 'Payment popup closed.' });
            setPaymentLoading(false);
          },
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.contact,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setToast({ type: 'error', message: 'Payment failed: ' + error.message });
      setPaymentLoading(false);
    }
  };

  const handlePayClick = () => {
    if (isSecureMode) {
      setShowSecureConfirm(true);
      return;
    }
    handlePayment(effectiveAmountInPaise);
  };

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
    <>
    <Helmet>
        <title>Nominee Check - keepmyasset</title>
        <meta name="description" content="Check nominee details easily with Your Site Name." />

        {/* Open Graph */}
        <meta property="og:title" content="Nominee Check - keepmyasset" />
        <meta property="og:description" content="Check nominee details easily with Your Site Name." />
        <meta property="og:url" content="https://www.keepmyasset.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:title" content="Nominee Check - keepmyasset" />
        <meta name="twitter:description" content="Check nominee details easily with keepmyasset" />
      </Helmet>
    <div className="nominee-check-page">
      {/* Hero Section */}
      {step === 1 && (
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              <FaHandHoldingHeart style={{ marginRight: '1rem', color: '#fbbf24' }} />
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
              <FaCertificate style={{ color: '#3b82f6' }} />
              Document Verification & Notification
            </h2>
            <div className="step-indicator">
              Step {step} of 3
            </div>
          </div>

          {/* Toast Notification */}
          {toast.message && (
            <div
              className={`toast-notification ${toast.type}`}
              tabIndex={-1}
              ref={toastRef}
              aria-live="assertive"
              role="alert"
            >
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
                    <FaUsers style={{ color: '#3b82f6' }} />
                    Policyholder Information
                  </h3>

                  <div className="input-row-horizontal">
                    <div className="input-group">
                      <label>
                        <FaEnvelope style={{ color: '#3b82f6' }} />
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
                    </div>

                    <div className="or-separator">
                      <span>OR</span>
                    </div>

                    <div className="input-group">
                      <label>
                        <FaPhoneAlt style={{ color: '#3b82f6' }} />
                        Phone Number
                        <FaInfoCircle
                          style={{ color: '#9ca3af', fontSize: '1rem', cursor: 'help' }}
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
                </div>

                <div className="form-section">
                  <h3>
                    <FaCertificate style={{ color: '#3b82f6' }} />
                    Death Certificate
                  </h3>

                  <div className="input-group">
                    <label>
                      <FaFileAlt style={{ color: '#3b82f6' }} />
                      Upload Document *
                      <FaInfoCircle
                        style={{ color: '#9ca3af', fontSize: '1rem', cursor: 'help' }}
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
                        <FaCloudUploadAlt style={{ fontSize: '1.5rem' }} />
                        Choose Death Certificate
                      </label>
                    )}

                    {file && (
                      <div className="file-display-container">
                        <div className="file-info">
                          <FaFileAlt style={{ fontSize: '1.5rem', color: '#1d4ed8' }} />
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
                      <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
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
              <div style={{ marginBottom: '3rem' }}>
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
                Payment Amount: ₹{isSecureMode ? '20,000' : '2,000'}
              </div>

              <div className="payment-features">
                <div className="payment-feature">
                  <FaBell className="payment-feature-icon" style={{ color: '#10b981' }} />
                  <h4>SMS Notifications</h4>
                  <p>Instant alerts to all nominees</p>
                </div>
                <div className="payment-feature">
                  <FaEnvelope className="payment-feature-icon" style={{ color: '#3b82f6' }} />
                  <h4>Email Notifications</h4>
                  <p>Detailed claim information</p>
                </div>
                <div className="payment-feature">
                  <FaLock className="payment-feature-icon" style={{ color: '#ef4444' }} />
                  <h4>Secure Process</h4>
                  <p>Bank-level encryption</p>
                </div>
              </div>

              <button
                onClick={handlePayClick}
                disabled={paymentLoading}
                className="submit-btn"
                style={{
                  maxWidth: '500px',
                  margin: '0 auto'
                }}
              >
                {paymentLoading ? (
                  <>
                    <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Pay ₹{isSecureMode ? '20,000' : '2,000'} Securely
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
                  <FaBell className="step-icon" style={{ color: '#10b981' }} />
                  <h4>SMS Sent</h4>
                  <p>Instant notifications delivered to all nominee phone numbers</p>
                </div>
                <div className="step-card">
                  <FaEnvelope className="step-icon" style={{ color: '#3b82f6' }} />
                  <h4>Emails Delivered</h4>
                  <p>Detailed claim information sent to all nominee email addresses</p>
                </div>
                <div className="step-card">
                  <FaHandHoldingHeart className="step-icon" style={{ color: '#f59e0b' }} />
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

      {/* Secure Mode Confirmation Modal - must be outside step blocks so it's always mounted */}
      <Modal
        isOpen={showSecureConfirm}
        onRequestClose={() => setShowSecureConfirm(false)}
        contentLabel="Secure Mode Confirmation"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FaLock style={{ color: '#16a34a' }} /> Secure Mode Is Enabled
        </h2>
        <div style={{ color: '#334155', lineHeight: 1.6 }}>
          <p>
            Because Secure Mode is ON for this account, we will perform additional manual verification
            before notifying nominees. This ensures extra protection against misuse and false notifications.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            Due to the manual review effort, the verification fee is <strong>₹20,000</strong> instead of ₹2,000.
          </p>
        </div>
        <div className="modal-buttons" style={{ marginTop: '1rem' }}>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => { setShowSecureConfirm(false); handleReset(); }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="add-btn"
            onClick={() => { setShowSecureConfirm(false); handlePayment(secureAmountInPaise); }}
          >
            Continue & Pay ₹20,000
          </button>
        </div>
      </Modal>
    </div>
    </>
  );
}

export default NomineeCheckPage;