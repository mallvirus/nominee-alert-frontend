import React from 'react';
import './Terms.css'; // Optional: for custom styling
import { Helmet } from 'react-helmet';

const Terms = () => {
  return (
    <>
      <Helmet>
            <title>Terms - keepmyasset</title>
            <meta name="description" content="Terms with keepmyasset" />
    
            {/* Open Graph */}
            <meta property="og:title" content="Terms - keepmyasset" />
            <meta property="og:description" content="Terms with keepmyasset." />
            <meta property="og:url" content="https://keepmyasset.com" />
            <meta property="og:type" content="website" />
    
            {/* Twitter Card */}
            <meta name="twitter:title" content="Terms - keepmyasset" />
            <meta name="twitter:description" content="Terms with keepmyasset." />
    </Helmet>
    <div className="page-container terms-page">
      <h1>Terms of Service</h1>
      <p>
        Welcome to our platform. By accessing or using our services, you agree to be bound by the terms and conditions
        outlined below. Please read them carefully.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By using our website or services, you acknowledge that you have read, understood, and agreed to be bound by
        these Terms of Service, as well as our Privacy Policy.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old or the legal age of majority in your jurisdiction to use our platform.
        Accounts created by automated methods are not permitted.
      </p>

      <h2>3. Account Responsibility</h2>
      <p>
        You are solely responsible for maintaining the confidentiality of your account information and any activity that
        occurs under your login credentials.
      </p>

      <h2>4. Use of Service</h2>
      <p>
        You agree to use our platform for lawful purposes only. You may not use the service in any way that may harm,
        disable, overburden, or impair our systems or interfere with any other user's use of the platform.
      </p>

      <h2>5. Privacy</h2>
      <p>
        We respect your privacy. Please review our{' '}
        <a href="/privacy" className="link">
          Privacy Policy
        </a>{' '}
        to understand how we collect, use, and protect your personal information.
      </p>

      <h2>6. Data Storage & Security</h2>
      <p>
        While we take reasonable measures to protect your data, we do not guarantee absolute security. You agree that
        your data may be stored and processed on secure third-party cloud services.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        All content on this platform, including text, graphics, logos, and software, is the property of our company and
        protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative
        works without explicit permission.
      </p>

      <h2>8. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your access to the platform at our sole discretion, with or without
        notice, for any conduct that violates these terms or is otherwise harmful.
      </p>

      <h2>9. Modifications to Terms</h2>
      <p>
        We may update or modify these Terms of Service at any time. Continued use of the platform after changes are
        posted constitutes your acceptance of the updated terms.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        We shall not be liable for any indirect, incidental, or consequential damages arising out of or in connection
        with your use of the platform, including but not limited to loss of data or service interruptions.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These terms are governed by the laws of India. Any disputes arising out of or related to these terms shall be
        subject to the exclusive jurisdiction of the courts located in your region of registration.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        For any questions or concerns regarding these Terms, please contact us at{' '}
        <a href="mailto:support@yourdomain.com" className="link">
          support@yourdomain.com
        </a>
        .
      </p>
    </div>
    </>
  );
};

export default Terms;
