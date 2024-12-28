// src/Footer.js

import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faBriefcase, faEnvelope, faHeart, faStar, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = ({ handleBubbleClick }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Navigation Links */}
        <div className="footer-links">
          <button onClick={() => handleBubbleClick("About")} className="footer-button">About</button>
          <button onClick={() => handleBubbleClick("Portfolio")} className="footer-button">Portfolio</button>
          <button onClick={() => handleBubbleClick("Contact")} className="footer-button">Contact</button>
          <button onClick={() => handleBubbleClick("Professional")} className="footer-button">Professional</button>
          <button onClick={() => handleBubbleClick("Publications")} className="footer-button">Publications</button>
          <button onClick={() => handleBubbleClick("Research")} className="footer-button">Research</button>
          <button onClick={() => handleBubbleClick("Awards")} className="footer-button">Awards</button>
          <button onClick={() => handleBubbleClick("Teaching")} className="footer-button">Teaching</button>
        </div>

        {/* Social Media Icons */}
        <div className="social-icons">
          <a href="https://github.com/AriadneD?tab=repositories" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="https://x.com/rediscoding" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="mailto:arid@mit.edu" aria-label="Email">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://www.linkedin.com/in/ariadnedulchinos/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Ariadne Dulchinos. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
