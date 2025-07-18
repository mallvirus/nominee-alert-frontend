import { FaLinkedin, FaFacebookF, FaTwitter, FaWhatsapp, FaInstagram } from "react-icons/fa";
import './Footer.css'; // Make sure you import the CSS
import { Helmet } from 'react-helmet';

const Footer = () => {
  return (
    <>
    <Helmet>
        <title>Footer - keepmyasset</title>
        <meta name="description" content="Footer with keepmyasset" />

        {/* Open Graph */}
        <meta property="og:title" content="Footer - keepmyasset" />
        <meta property="og:description" content="Footer with keepmyasset." />
        <meta property="og:url" content="https://keepmyasset.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:title" content="Footer - keepmyasset" />
        <meta name="twitter:description" content="Footer with keepmyasset." />
      </Helmet>
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
          <a href="https://www.instagram.com/keepmyassets/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61577883366291" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://x.com/keepmyasset" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        </div>
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} Nominee Notify. All rights reserved.
      </div>
    </footer>
    </>
  );
};

export default Footer;
