import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import Modal from 'react-modal';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import {
  FaTrash,
  FaPlus,
  FaInfoCircle,
  FaShieldAlt,
  FaUserCheck,
  FaLock,
  FaRocket,
  FaCheckCircle
} from 'react-icons/fa';

Modal.setAppElement('#root');

const Home = ({ user }) => {
  const [nominees, setNominees] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nomineeEmail: '',
    nomineePhone: '',
    policyDocument: null,
    providerName: ''
  });
  const [errors, setErrors] = useState({ nomineePhone: '', policyDocument: '' });

  const fetchNominees = async () => {
    if (user?.id) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HOST_SERVER}/api/nominees/find/by/UserId?userId=${user.id}`
        );
        setNominees(response.data.data);
      } catch (error) {
        console.error('Error fetching nominee data:', error);
      }
    }
  };

  useEffect(() => {
    fetchNominees();
  }, [user]);

  const handleRemove = async (nomineeId, policyId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_HOST_SERVER}/api/nominees/${nomineeId}/policy/${policyId}`
      );
      setNominees(nominees.filter(n => n.nomineeId !== nomineeId));
    } catch (error) {
      console.error('Error removing nominee:', error);
      alert('Failed to remove nominee. Please try again.');
    }
  };

  const validatePhone = (phone) => {
    if (!/^[0-9]{10}$/.test(phone)) {
      return 'Phone number must be 10 digits.';
    }
    return '';
  };

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    return allowedTypes.includes(file?.type);
  };

  const handleAddNominee = async (e) => {
    e.preventDefault();
    const { nomineeEmail, nomineePhone, policyDocument, providerName } = formData;

    const phoneError = validatePhone(nomineePhone);
    const docError = policyDocument && !validateFile(policyDocument)
      ? 'Only PDF, JPG or PNG files are allowed.'
      : '';

    setErrors({ nomineePhone: phoneError, policyDocument: docError });

    if (!nomineeEmail || !nomineePhone || !policyDocument || !providerName) {
      alert('All fields are required.');
      return;
    }

    if (phoneError || docError) {
      return;
    }

    const payload = new FormData();
    payload.append('nomineeEmail', nomineeEmail);
    payload.append('nomineePhone', nomineePhone);
    payload.append('providerName', providerName);
    payload.append('userId', user.id);
    payload.append('policyDocument', policyDocument);

    try {
      await axios.post(
        `${process.env.REACT_APP_HOST_SERVER}/api/nominees/create/via/file`,
        payload
      );
      alert('Nominee added successfully!');
      setModalOpen(false);
      setFormData({ nomineeEmail: '', nomineePhone: '', providerName: '', policyDocument: null });
      setErrors({ nomineePhone: '', policyDocument: '' });
      fetchNominees();
    } catch (error) {
      console.error('Error adding nominee:', error);
      alert('Failed to add nominee.');
    }
  };

  return (
    <div className="home-layout">
      {!user ? (
        <p>Please log in to continue</p>
      ) : (
        <section className="user-info-section">
          <div className="section-header">
            <h3>Your Nominees</h3>
            <button className="add-icon-btn" onClick={() => setModalOpen(true)}>
              <FaPlus className="add-icon" data-tooltip-id="tooltip-add" data-tooltip-content="Add nominee details" />
            </button>
            <ReactTooltip id="tooltip-add" />
          </div>

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
                      <span className="label">Provider:</span>
                      <span className="value">{nominee.providerName}</span>
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

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setModalOpen(false)}
            contentLabel="Add Nominee"
            className="modal"
            overlayClassName="modal-overlay"
          >
            <h2>Add Nominee</h2>
            <form onSubmit={handleAddNominee} className="modal-form">
  <label>
    Email
    <FaInfoCircle
      className="tooltip-icon"
      data-tooltip-id="tooltip-email"
      data-tooltip-content="Enter nominee's email address"
    />
    <input
      type="email"
      required
      placeholder="e.g. john.doe@example.com"
      value={formData.nomineeEmail}
      onChange={(e) => setFormData({ ...formData, nomineeEmail: e.target.value })}
    />
  </label>

  <label>
    Phone Number
    <FaInfoCircle
      className="tooltip-icon"
      data-tooltip-id="tooltip-phone"
      data-tooltip-content="10-12 digit numeric phone number"
    />
    <input
      type="tel"
      required
      placeholder="e.g. 9876543210"
      className={errors.nomineePhone ? 'input-error' : ''}
      value={formData.nomineePhone}
      onChange={(e) => setFormData({ ...formData, nomineePhone: e.target.value })}
    />
    {errors.nomineePhone && <div className="error-message">{errors.nomineePhone}</div>}
  </label>

  <label>
    Provider Name
    <FaInfoCircle
      className="tooltip-icon"
      data-tooltip-id="tooltip-provider"
      data-tooltip-content="Enter the provider name"
    />
    <input
      type="text"
      required
      placeholder="e.g. LIC, HDFC Life"
      value={formData.providerName}
      onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
    />
  </label>

  <label>
    Policy Document
    <FaInfoCircle
      className="tooltip-icon"
      data-tooltip-id="tooltip-doc"
      data-tooltip-content="Only PDF, JPG, or PNG allowed"
    />
    <input
      type="file"
      accept=".pdf,image/jpeg,image/png"
      required
      className={errors.policyDocument ? 'input-error' : ''}
      onChange={(e) => setFormData({ ...formData, policyDocument: e.target.files[0] })}
    />
    {errors.policyDocument && <div className="error-message">{errors.policyDocument}</div>}
  </label>

  <div className="modal-buttons">
    <button type="submit" className="add-btn">Add Nominee</button>
    <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>Cancel</button>
  </div>
</form>


            <ReactTooltip id="tooltip-email" />
            <ReactTooltip id="tooltip-phone" />
            <ReactTooltip id="tooltip-doc" />
            <ReactTooltip id="tooltip-provider" />
          </Modal>
        </section>
      )}
    </div>
  );
};

export default Home;
