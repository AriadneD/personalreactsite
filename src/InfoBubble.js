// src/InfoBubble.js

import React, { useState } from 'react';
import './InfoBubble.css';

const InfoBubble = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleIconClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleIconClick();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="info-bubble" role="dialog" aria-modal="true" aria-labelledby="infoBubbleTitle">
          <div className="bubble-content">
            <button className="close-button" onClick={handleClose} aria-label="Close Info Bubble">
              &times;
            </button>
            <p className="message" id="infoBubbleTitle">
            <h3>Welcome to My Universe! 🦝✨</h3>
            <p>
                Hey there, I’m Space Raccoon, your guide to exploring this interactive universe! Here’s how you can navigate:
            </p>
            <ul>
                <li><strong>Planets:</strong> Click on a planet to zoom in and learn fascinating info about it.</li>
                <li><strong>Sidebars:</strong> Scroll through both sidebars to explore content, or close them for a better view.</li>
                <li><strong>Bubbles:</strong> Click each bubble to dive into different parts of my professional experience.</li>
                <li><strong>Camera Icon:</strong> Toggle between a free-look mode and a fixed planetary landscape.</li>
            </ul>
            <p>
                This site was crafted using <strong>React</strong>, <strong>Three.js</strong>, and <strong>Firebase</strong>, with beautiful <strong>FontAwesome icons</strong> and stunning AI-generated graphics. Enjoy the journey! 🚀
            </p>
            </p>
          </div>
          <div className="bubble-triangle"></div>
        </div>
      )}
      <div
        className="floating-icon"
        onClick={handleIconClick}
        onKeyPress={handleKeyPress}
        aria-label="Toggle Info Bubble"
        role="button"
        tabIndex={0}
      >
        <img
          src="https://i.ibb.co/XSv28S7/Screenshot-2024-12-27-at-11-12-01-AM.png"
          alt="Info"
          width="50"
          height="50"
        />
      </div>
    </>
  );
};

export default InfoBubble;
