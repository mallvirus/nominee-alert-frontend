import { FaLinkedin, FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";
import './Footer.css'; // Make sure you import the CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links-container">
        <div className="footer-links-left">
          <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
        </div>
        <div className="footer-links-right">
          <a href="https://wa.me/918177009416" target="_blank" rel="noopener noreferrer">
    <FaWhatsapp />
  </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        </div>
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} Nominee Notify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
