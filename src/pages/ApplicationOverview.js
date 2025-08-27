import React from 'react';
import { 
  FaFolderOpen, 
  FaUsers, 
  FaBell, 
  FaLock, 
  FaUpload, 
  FaUserPlus, 
  FaPaperPlane, 
  FaShieldAlt 
} from 'react-icons/fa';

const ApplicationOverview = ({ user, onLoginSuccess }) => {
  // CTA for login in CTA section
  const handleLoginClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div style={styles.container}>
      {/* Intro / Summary */}
      <header style={styles.header}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Application Overview</h1>
        </div>
        <p style={styles.subtitle}>
          KeepMyAsset is your trusted partner in securing your family’s financial future. Upload your insurance documents, assign nominees, and ensure your loved ones are automatically notified when it matters most — all with complete privacy and security.
        </p>
      </header>

      {/* Key Benefits */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Key Benefits</h2>
        <div style={styles.benefitsGrid}>
          <BenefitCard 
            icon={<FaFolderOpen size={36} color="#2563eb" />} 
            title="Centralized Policy Storage" 
            description="All your insurance documents organized securely in one place." 
          />
          <BenefitCard 
            icon={<FaUsers size={36} color="#10b981" />} 
            title="Nominee Mapping" 
            description="Assign multiple nominees with verified contact details." 
          />
          <BenefitCard 
            icon={<FaBell size={36} color="#f59e0b" />} 
            title="Auto Notifications" 
            description="Automatic alerts sent to nominees during critical events." 
          />
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.howItWorksGrid}>
          <HowItWorksCard 
            icon={<FaUpload size={48} color="#2563eb" />} 
            title="Upload Policies" 
            description="Securely upload all your insurance documents in PDF, JPG, or PNG formats." 
          />
          <HowItWorksCard 
            icon={<FaUserPlus size={48} color="#10b981" />} 
            title="Add Nominees" 
            description="Assign trusted family members or friends as nominees with verified contact info." 
          />
          <HowItWorksCard 
            icon={<FaPaperPlane size={48} color="#f59e0b" />} 
            title="We Notify" 
            description="Automatic alerts sent to your nominees via email and SMS when it matters." 
          />
        </div>
      </section>

      {/* Why Use KeepMyAsset */}
      <section style={{ ...styles.section, backgroundColor: '#e0f2fe', borderRadius: 12, padding: '2rem' }}>
        <h2 style={styles.sectionTitle}>Why Use KeepMyAsset?</h2>
        <div style={styles.trustContent}>
          <div style={styles.trustText}>
            <p style={styles.trustItem}>
              <FaShieldAlt color="#2563eb" style={{ marginRight: 8 }} />
              End-to-end encrypted data security ensuring your information is safe and private.
            </p>
            <p style={styles.trustItem}>
              <FaUsers color="#10b981" style={{ marginRight: 8 }} />
              Trusted by over <strong>10,000+ policies</strong> securely stored.
            </p>
          </div>
          <blockquote style={styles.testimonial}>
            “KeepMyAsset gave me peace of mind knowing my family will never miss out on their benefits.”
            <footer style={styles.testimonialAuthor}>— Anjali Mehta, Mumbai</footer>
          </blockquote>
        </div>
      </section>

      {/* FAQs */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
        <FAQ question="Is my data secure?" answer="Yes, all data is encrypted with bank-level security and never shared with third parties." />
        <FAQ question="How does notification work?" answer="Nominees receive automatic alerts via email and SMS when critical events occur." />
        <FAQ question="Is this free to use?" answer="Yes, you can start protecting your family's future with our free plan. Premium plans offer additional features." />
      </section>

      {/* Call to Action */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Start protecting your family's future today.</h2>
        {!user ? (
          <button style={styles.ctaButton} onClick={handleLoginClick}>
            Create Free Account
          </button>
        ) : (
          <button style={styles.ctaButton} onClick={() => window.location.href = '/'}>
            Go to Dashboard
          </button>
        )}
      </section>
    </div>
  );
};

const BenefitCard = ({ icon, title, description }) => (
  <div style={styles.benefitCard}>
    <div style={styles.benefitIcon}>{icon}</div>
    <h3 style={styles.benefitTitle}>{title}</h3>
    <p style={styles.benefitDescription}>{description}</p>
  </div>
);

const HowItWorksCard = ({ icon, title, description }) => (
  <div style={styles.howItWorksCard}>
    <div style={styles.howItWorksIcon}>{icon}</div>
    <h3 style={styles.howItWorksTitle}>{title}</h3>
    <p style={styles.howItWorksDescription}>{description}</p>
  </div>
);

const FAQ = ({ question, answer }) => (
  <div style={styles.faqItem}>
    <h4 style={styles.faqQuestion}>{question}</h4>
    <p style={styles.faqAnswer}>{answer}</p>
  </div>
);

const styles = {
  container: {
    maxWidth: 900,
    margin: '2rem auto',
    padding: '0 1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#334155',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '2.75rem',
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#64748b',
    maxWidth: 600,
    margin: '0 auto',
  },
  section: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: '1.5rem',
    textAlign: 'center',
    borderBottom: 'none',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '2rem',
  },
  benefitCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
    textAlign: 'center',
  },
  benefitIcon: {
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 8,
  },
  benefitDescription: {
    fontSize: 16,
    color: '#475569',
  },
  howItWorksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '2rem',
  },
  howItWorksCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: '2rem 1.5rem',
    textAlign: 'center',
    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.1)',
  },
  howItWorksIcon: {
    marginBottom: 16,
  },
  howItWorksTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2563eb',
  },
  howItWorksDescription: {
    fontSize: 16,
    color: '#475569',
  },
  trustContent: {
    maxWidth: 700,
    margin: '0 auto',
    textAlign: 'center',
  },
  trustText: {
    fontSize: 18,
    color: '#334155',
    marginBottom: 24,
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  testimonial: {
    fontStyle: 'italic',
    fontSize: 18,
    color: '#1e40af',
    borderLeft: '4px solid #2563eb',
    paddingLeft: 20,
    maxWidth: 600,
    margin: '0 auto',
  },
  testimonialAuthor: {
    marginTop: 12,
    fontWeight: '700',
    color: '#2563eb',
    textAlign: 'right',
  },
  faqItem: {
    marginBottom: 20,
    maxWidth: 700,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  faqQuestion: {
    fontWeight: '700',
    fontSize: 18,
    color: '#1e40af',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 16,
    color: '#475569',
  },
  ctaSection: {
    textAlign: 'center',
    padding: '3rem 1rem',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    color: 'white',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#10b981',
    border: 'none',
    borderRadius: 8,
    padding: '0.75rem 2.5rem',
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default ApplicationOverview;