import React from 'react';
import './Privacy.css'; // Optional for custom styling
import { Helmet } from 'react-helmet';

const Privacy = () => {
  return (
    <>
    <Helmet>
            <title>Privacy - keepmyasset</title>
            <meta name="description" content="Privacy with keepmyasset" />
    
            {/* Open Graph */}
            <meta property="og:title" content="Privacy - keepmyasset" />
            <meta property="og:description" content="Privacy with keepmyasset." />
            <meta property="og:url" content="https://keepmyasset.com" />
            <meta property="og:type" content="website" />
    
            {/* Twitter Card */}
            <meta name="twitter:title" content="Privacy - keepmyasset" />
            <meta name="twitter:description" content="Privacy with keepmyasset." />
    </Helmet>
    <div className="page-container privacy-page">
      <h1>Privacy Policy</h1>
      <p>
        Your privacy is important to us. This Privacy Policy describes how we collect, use, disclose, and protect your
        personal information when you use our platform.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We may collect the following types of information:</p>
      <ul>
        <li><strong>Personal Information:</strong> Name, email address, phone number, and policy documents.</li>
        <li><strong>Account Information:</strong> Login credentials, user preferences, and nominee data.</li>
        <li><strong>Usage Data:</strong> Pages visited, actions taken, time spent, and browser/device info.</li>
        <li><strong>Cookies and Tracking:</strong> We may use cookies and similar technologies for analytics and session management.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>Your data helps us:</p>
      <ul>
        <li>Deliver and maintain our services</li>
        <li>Notify nominees during critical life events</li>
        <li>Improve user experience and platform performance</li>
        <li>Respond to support and feedback queries</li>
        <li>Send service updates and security alerts</li>
      </ul>

      <h2>3. Data Sharing and Disclosure</h2>
      <p>We do <strong>not</strong> sell or share your personal information with third parties, except:</p>
      <ul>
        <li>With your explicit consent</li>
        <li>To comply with legal obligations or governmental requests</li>
        <li>With trusted service providers under strict confidentiality agreements (e.g., cloud storage)</li>
      </ul>

      <h2>4. Data Retention</h2>
      <p>
        We retain your information only as long as necessary for legal or business purposes, or until your account is
        deleted. You can request data deletion by contacting us directly.
      </p>

      <h2>5. Security Measures</h2>
      <p>
        We use modern encryption, secure servers, and access controls to protect your data. However, no system is 100%
        secure, and we cannot guarantee absolute protection.
      </p>

      <h2>6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the data we hold about you</li>
        <li>Request corrections to inaccurate data</li>
        <li>Request deletion of your personal data</li>
        <li>Withdraw consent to data processing at any time</li>
      </ul>

      <h2>7. Cookies</h2>
      <p>
        We use cookies to store session data and improve functionality. You can manage cookie preferences in your
        browser settings.
      </p>

      <h2>8. Children's Privacy</h2>
      <p>
        Our services are not directed to individuals under the age of 13. We do not knowingly collect personal
        information from children.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Changes will be posted on this page, and your continued use
        constitutes acceptance.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or your data, please contact us at{' '}
        <a href="mailto:support@yourdomain.com" className="link">
          support@yourdomain.com
        </a>
        .
      </p>
    </div>
    </>
  );
};

export default Privacy;
