import { FaFacebookF, FaTwitter, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './Footer.css';
import { Helmet } from 'react-helmet';

const Footer = () => (
  <>
    <Helmet>{/* Open Graph and Twitter card tags */}</Helmet>
    <footer className="footer">
      <div className="footer-links-container">
        <div className="footer-branding">
          <span className="footer-logo">
            <span className="logo-main">Keep</span>
            <span className="logo-accent">MyAsset</span>
          </span>
          <span className="footer-slogan">
            Securing Your Digital Legacy
          </span>
        </div>
        <div className="footer-links-center">
          {/* First row: Main navigation */}
          <div className="footer-links-row">
            <Link to="/about">About</Link>
            <Link to="/features">Features</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
          </div>
          {/* Second row: Legal links */}
          <div className="footer-legal-row">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
        <div className="footer-social-icons">
          <a
            href="https://www.facebook.com/keepmyasset/"
            target="_blank"
            rel="noopener"
            className="social-icon facebook"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com/keepmyasset/"
            target="_blank"
            rel="noopener"
            className="social-icon twitter"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener"
            className="social-icon whatsapp"
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://instagram.com/keepmyasset/"
            target="_blank"
            rel="noopener"
            className="social-icon instagram"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
      <div className="footer-copy">
        © {new Date().getFullYear()} keepmyasset. All rights reserved.
      </div>
    </footer>
  </>
);

export default Footer;
