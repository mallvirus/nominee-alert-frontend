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
            <a href="https://wa.me/918177009416" target="_blank" rel="noopener">Contact</a>
          </div>
          {/* Second row: Legal links */}
          <div className="footer-legal-row">
            <a href="/Privacy.html" target="_blank" rel="noopener">Privacy Policy</a>
            <a href="/Terms.html" target="_blank" rel="noopener">Terms & Conditions</a>
          </div>
        </div>
        <div className="footer-social-icons">
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
            href="https://wa.me/916387509734"
            target="_blank"
            rel="noopener"
            className="social-icon whatsapp"
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://instagram.com/keepmyassets/"
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
