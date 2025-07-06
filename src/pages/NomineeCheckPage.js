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
  FaHeart,
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
  FaRedo
} from 'react-icons/fa';

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
  };

  return (
    <div className="nominee-check-page">
      {/* Hero Section */}


      {/* Main Form Section */}
      <section className="search-results">
        <div className="results-header">
          <h2>
            <FaCertificate style={{color: '#2563eb'}} />
            Document Verification & Notification
          </h2>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <span style={{
              background: 'var(--primary-blue-light)',
              color: 'var(--primary-blue)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              Step {step} of 3
            </span>
          </div>
        </div>

        {/* Toast Notification */}
        {toast.message && (
          <div className={`toast-notification ${toast.type}`} style={{
            padding: 'var(--space-lg)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-2xl)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            fontWeight: '600',
            fontSize: '1.125rem',
            background: toast.type === 'error' ? 'var(--accent-red-light)' : 
                       toast.type === 'success' ? 'var(--accent-green-light)' : 
                       'var(--primary-blue-light)',
            color: toast.type === 'error' ? 'var(--accent-red)' : 
                   toast.type === 'success' ? 'var(--accent-green)' : 
                   'var(--primary-blue)',
            border: `2px solid ${toast.type === 'error' ? 'var(--accent-red)' : 
                                 toast.type === 'success' ? 'var(--accent-green)' : 
                                 'var(--primary-blue)'}`,
            boxShadow: 'var(--shadow-lg)'
          }}>
            {toast.type === 'error' && <FaExclamationTriangle />}
            {toast.type === 'success' && <FaCheckCircle />}
            {toast.type === 'info' && <FaInfoCircle />}
            {toast.message}
          </div>
        )}

        {/* Step 1: Upload Form */}
        {step === 1 && (
          <div className="upload-form-container" style={{
            background: 'var(--gradient-card)',
            padding: 'var(--space-3xl)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--gray-200)'
          }}>
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-section" style={{marginBottom: 'var(--space-2xl)'}}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--space-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)'
                }}>
                  <FaUsers style={{color: 'var(--primary-blue)'}} />
                  Policyholder Information
                </h3>
                
                <div className="input-row">
  <label>
    <FaEnvelope style={{color: '#2563eb', marginRight: 8}} />
    Email Address
  </label>
  <input
    type="email"
    value={email}
    onChange={(e) => handleEmailChange(e.target.value)}
    placeholder="e.g. john.doe@example.com"
    className={errors.email ? 'input-error' : ''}
  />
  {errors.email && <div className="error-message">{errors.email}</div>}

  <label>
    <FaPhoneAlt style={{color: '#2563eb', marginRight: 8}} />
    Phone Number
  </label>
  <input
    type="tel"
    value={phone}
    onChange={(e) => handlePhoneChange(e.target.value)}
    placeholder="e.g. 9876543210"
    className={errors.phone ? 'input-error' : ''}
    maxLength={10}
  />
  {errors.phone && <div className="error-message">{errors.phone}</div>}
</div>
                <div style={{
                  textAlign: 'center',
                  margin: 'var(--space-lg) 0',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '0',
                    right: '0',
                    height: '1px',
                    background: 'var(--gray-200)'
                  }}></div>
                  <span style={{
                    background: 'var(--white)',
                    padding: '0 var(--space-lg)',
                    color: 'var(--gray-500)',
                    fontWeight: '500',
                    position: 'relative'
                  }}>OR</span>
                </div>

                <div className="input-group" style={{marginBottom: 'var(--space-2xl)'}}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-sm)',
                    fontWeight: '600',
                    color: 'var(--gray-800)',
                    fontSize: '1.125rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)'
                  }}>
                    <FaPhoneAlt style={{color: 'var(--primary-blue)'}} />
                    Phone Number
                    <FaInfoCircle 
                      style={{color: 'var(--gray-400)', fontSize: '1rem', cursor: 'help'}}
                      title="10-digit Indian mobile number (without +91 or 0 prefix)"
                    />
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    className={errors.phone ? 'input-error' : ''}
                    style={{
                      width: '100%',
                      padding: 'var(--space-lg)',
                      border: `2px solid ${errors.phone ? 'var(--accent-red)' : 'var(--gray-200)'}`,
                      borderRadius: 'var(--radius-md)',
                      fontSize: '1rem',
                      background: errors.phone ? 'var(--accent-red-light)' : 'var(--gray-50)',
                      transition: 'var(--transition)',
                      fontFamily: 'var(--font-primary)'
                    }}
                    onFocus={(e) => {
                      if (!errors.phone) {
                        e.target.style.borderColor = 'var(--primary-blue)';
                        e.target.style.background = 'var(--white)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.phone) {
                        e.target.style.borderColor = 'var(--gray-200)';
                        e.target.style.background = 'var(--gray-50)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  {errors.phone && (
                    <div className="error-message" style={{
                      color: 'var(--accent-red)',
                      fontSize: '0.875rem',
                      marginTop: 'var(--space-sm)',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-xs)'
                    }}>
                      <FaExclamationTriangle />
                      {errors.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section" style={{marginBottom: 'var(--space-2xl)'}}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--space-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)'
                }}>
                  <FaCertificate style={{color: 'var(--primary-blue)'}} />
                  Death Certificate
                </h3>

                <div className="input-group">
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-sm)',
                    fontWeight: '600',
                    color: 'var(--gray-800)',
                    fontSize: '1.125rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)'
                  }}>
                    <FaFileAlt style={{color: 'var(--primary-blue)'}} />
                    Upload Document *
                    <FaInfoCircle 
                      style={{color: 'var(--gray-400)', fontSize: '1rem', cursor: 'help'}}
                      title="Upload PDF, JPG, or PNG file (maximum 5MB). Ensure document is clear and readable."
                    />
                  </label>
                  
                  <label className="custom-file-upload" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                    padding: 'var(--space-lg) var(--space-2xl)',
                    background: 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)',
                    color: 'var(--gray-800)',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    boxShadow: 'var(--shadow-lg)',
                    border: 'none',
                    marginTop: 'var(--space-sm)',
                    marginBottom: 'var(--space-sm)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <FaCloudUploadAlt style={{fontSize: '1.4rem', color: 'var(--accent-green)'}} />
                    {fileName || 'Choose Death Certificate'}
                  </label>

                  {file && (
                    <div style={{
                      marginTop: 'var(--space-lg)',
                      padding: 'var(--space-lg)',
                      background: 'linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%)',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '0.875rem',
                      color: 'var(--primary-blue-dark)',
                      border: '1px solid var(--primary-blue-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-sm)'
                    }}>
                      <FaFileAlt />
                      <span style={{flex: 1}}>{fileName}</span>
                      <span style={{color: 'var(--gray-600)'}}>
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}

                  {errors.file && (
                    <div className="error-message" style={{
                      color: 'var(--accent-red)',
                      fontSize: '0.875rem',
                      marginTop: 'var(--space-sm)',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-xs)'
                    }}>
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
                style={{
                  width: '100%',
                  background: loading ? 'var(--gray-400)' : 'var(--gradient-cta)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: 'var(--space-lg) var(--space-2xl)',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-sm)',
                  boxShadow: loading ? 'none' : 'var(--shadow-lg)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = 'var(--shadow-xl)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'var(--shadow-lg)';
                  }
                }}
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
          <div className="payment-container" style={{
            background: 'var(--gradient-card)',
            padding: 'var(--space-3xl)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--gray-200)',
            textAlign: 'center'
          }}>
            <div style={{marginBottom: 'var(--space-2xl)'}}>
              <FaCreditCard style={{
                fontSize: '4rem',
                color: 'var(--primary-blue)',
                marginBottom: 'var(--space-lg)'
              }} />
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                color: 'var(--gray-900)',
                marginBottom: 'var(--space-md)'
              }}>
                Secure Payment Required
              </h3>
              <p style={{
                fontSize: '1.25rem',
                color: 'var(--gray-600)',
                marginBottom: 'var(--space-xl)'
              }}>
                Complete the payment to notify all registered nominees
              </p>
            </div>

            <div style={{
              background: 'var(--accent-orange-light)',
              color: 'var(--accent-orange)',
              padding: 'var(--space-xl)',
              borderRadius: 'var(--radius-xl)',
              marginBottom: 'var(--space-2xl)',
              border: '2px solid var(--accent-orange)',
              fontWeight: '600',
              fontSize: '1.375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-sm)'
            }}>
              <FaRupeeSign />
              Payment Amount: ₹2,000
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-lg)',
              marginBottom: 'var(--space-2xl)',
              padding: 'var(--space-xl)',
              background: 'var(--gray-50)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--gray-200)'
            }}>
              <div style={{textAlign: 'center'}}>
                <FaBell style={{fontSize: '2rem', color: 'var(--accent-green)', marginBottom: 'var(--space-sm)'}} />
                <h4 style={{fontSize: '1rem', fontWeight: '600', color: 'var(--gray-800)'}}>SMS Notifications</h4>
                <p style={{fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0}}>Instant alerts to all nominees</p>
              </div>
              <div style={{textAlign: 'center'}}>
                <FaEnvelope style={{fontSize: '2rem', color: 'var(--primary-blue)', marginBottom: 'var(--space-sm)'}} />
                <h4 style={{fontSize: '1rem', fontWeight: '600', color: 'var(--gray-800)'}}>Email Notifications</h4>
                <p style={{fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0}}>Detailed claim information</p>
              </div>
              <div style={{textAlign: 'center'}}>
                <FaLock style={{fontSize: '2rem', color: 'var(--accent-red)', marginBottom: 'var(--space-sm)'}} />
                <h4 style={{fontSize: '1rem', fontWeight: '600', color: 'var(--gray-800)'}}>Secure Process</h4>
                <p style={{fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0}}>Bank-level encryption</p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              style={{
                width: '100%',
                background: paymentLoading ? 'var(--gray-400)' : 'var(--gradient-success)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: 'var(--space-lg) var(--space-2xl)',
                fontWeight: '600',
                fontSize: '1.125rem',
                cursor: paymentLoading ? 'not-allowed' : 'pointer',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-sm)',
                boxShadow: paymentLoading ? 'none' : 'var(--shadow-lg)',
                maxWidth: '400px',
                margin: '0 auto'
              }}
              onMouseEnter={(e) => {
                if (!paymentLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = 'var(--shadow-xl)';
                }
              }}
              onMouseLeave={(e) => {
                if (!paymentLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'var(--shadow-lg)';
                }
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
          <div className="success-container" style={{
            background: 'var(--gradient-card)',
            padding: 'var(--space-3xl)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--gray-200)',
            textAlign: 'center'
          }}>
            <div className="success-message" style={{
              marginBottom: 'var(--space-3xl)'
            }}>
              <FaCheckCircle className="success-icon" />
              <h3>Payment Successful!</h3>
              <p>All registered nominees have been notified via SMS and Email about the policy claim.</p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--space-xl)',
              marginBottom: 'var(--space-3xl)'
            }}>
              <div className="step-card">
                <FaBell className="step-icon" />
                <h4>SMS Sent</h4>
                <p>Instant notifications delivered to all nominee phone numbers</p>
              </div>
              <div className="step-card">
                <FaEnvelope className="step-icon" />
                <h4>Emails Delivered</h4>
                <p>Detailed claim information sent to all nominee email addresses</p>
              </div>
              <div className="step-card">
                <FaHandHoldingHeart className="step-icon" />
                <h4>Families Informed</h4>
                <p>Beneficiaries can now proceed with their rightful claims</p>
              </div>
            </div>

            <button
              onClick={handleReset}
              style={{
                background: 'var(--gradient-cta)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: 'var(--space-lg) var(--space-2xl)',
                fontWeight: '600',
                fontSize: '1.125rem',
                cursor: 'pointer',
                transition: 'var(--transition)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                boxShadow: 'var(--shadow-lg)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'var(--shadow-lg)';
              }}
            >
              <FaRedo />
              Process Another Certificate
            </button>
          </div>
        )}
      </section>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .custom-file-upload:hover {
          background: linear-gradient(135deg, #34d399 0%, #6ee7b7 100%) !important;
          color: var(--gray-900) !important;
          box-shadow: var(--shadow-xl) !important;
          transform: translateY(-2px) scale(1.03) !important;
        }
          .input-row {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 420px;
  margin: 0 auto;
}
.input-row label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.input-row input {
  width: 100%;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 2px solid #e5e7eb;
  background: #f9fafb;
  font-size: 1rem;
  transition: border 0.2s, box-shadow 0.2s;
}
.input-row input:focus {
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 0 0 2px #2563eb22;
}
.input-error {
  border-color: #ef4444 !important;
  background: #fef2f2 !important;
}
      `}</style>
    </div>
  );
}

export default NomineeCheckPage;