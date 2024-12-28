// src/PortfolioSlideshow.js

import React, { useState } from 'react';
import './PortfolioSlideshow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBed, faKeyboard, faHeartbeat, faCheckCircle, faBolt, faCogs, faLightbulb, faNetworkWired, faBrain, faChartLine, faArrowRight, faGlobe, faUserFriends, faNewspaper, faBook, faBriefcase } from '@fortawesome/free-solid-svg-icons';

const projects = [
  {
    id: 1,
    name: 'Assorted Projects for Clients - arinthia.design',
    image: 'https://i.ibb.co/PmJNXRn/Screenshot-2024-12-28-at-12-54-49-PM.png',
    features: [
      {
        title: 'Responsive Design',
        icon: faBolt,
        points: ['Mobile-friendly layout', 'Cross-browser compatibility', 'Adaptive images'],
      },
      {
        title: 'Interactive UI',
        icon: faCogs,
        points: ['Smooth transitions', 'Dynamic content loading', 'User-friendly navigation'],
      },
      {
        title: 'SEO Optimized',
        icon: faCheckCircle,
        points: ['Meta tags integration', 'Sitemap generation', 'Fast loading times'],
      },
    ],
    liveDemo: 'https://arinthia.design/',
  },
  {
    id: 2,
    name: 'CNN-Based Detection of Alzheimer’s and Dementia',
    image: 'https://i.ibb.co/MCtz6fm/Screenshot-2024-12-28-at-12-58-39-PM.png',
    features: [
      {
        title: 'Motivation',
        icon: faLightbulb,
        points: [
          'Manual EEG analysis is time-consuming, error-prone, and not scalable.',
          'Deep learning offers a scalable, interpretable method for diagnosis.',
        ],
      },
      {
        title: 'Key Methods',
        icon: faBrain,
        points: [
          'Converted EEG signals to spectrograms and chromagrams.',
          'Used CNNs for classification into healthy, Alzheimer’s, or dementia.',
          'Input: EECGs condensed into 7 frequency bands.',
        ],
      },
      {
        title: 'CNN Architecture',
        icon: faNetworkWired,
        points: [
          'Conv2D layers: 32 and 64 filters with ReLU activation.',
          'MaxPooling, Dropout layers to prevent overfitting.',
          'Output: Softmax classification into 3 categories.',
        ],
      },
      {
        title: 'Results',
        icon: faChartLine,
        points: [
          'Achieved AUC = 0.837 using optimized STFT parameters.',
          'Window length 256 performed best over 25 training epochs.',
          'Interpretable and cost-effective results from EEG data.',
        ],
      },
      {
        title: 'Next Steps',
        icon: faArrowRight,
        points: [
          'Optimize hyperparameters and explore additional feature extraction.',
          'Address class imbalance and limited training data.',
        ],
      },
    ],
    liveDemo: 'https://docs.google.com/presentation/d/1_5DKrX1rl_t5PrYHBQUMNuTNYi1_VXNn2uN7Mh84X7A/edit?usp=sharing', // Add the link if available
  },
  {
    id: 3,
    name: 'Astrania.org',
    image: 'https://i.ibb.co/wCzYc3X/Screenshot-2024-12-28-at-1-02-26-PM.png',
    features: [
      {
        title: 'Overview',
        icon: faGlobe,
        points: [
          'With 100+ members representing 20+ universities, Astrania empowers Latin Americans with free AI resources.',
          'Supports Spanish-speaking students, small businesses, and entrepreneurs.',
          'Addresses the language barrier in AI education and innovation.',
        ],
      },
      {
        title: 'AI Blog & Newsletter',
        icon: faNewspaper,
        points: [
          'Publishes technically rigorous Spanish-language AI news.',
          'Releases content at the same pace as popular English platforms.',
          'Covers the latest trends and advancements in AI technology.',
        ],
      },
      {
        title: 'Mentorship Program',
        icon: faUserFriends,
        points: [
          'First Spanish-language AI mentorship exclusively for Latin Americans.',
          'Builds infrastructure for networking, learning, and AI innovation.',
          'Focuses on fostering local talent and connections within the region.',
        ],
      },
      {
        title: 'Resource Encyclopedia',
        icon: faBook,
        points: [
          'Hosts a vast collection of free courses, tutorials, and research.',
          'Curated from high-quality sources for all AI learners.',
          'Supports students in the early stages of their AI careers.',
        ],
      },
      {
        title: 'AI Job Board',
        icon: faBriefcase,
        points: [
          'Updates daily with the latest AI/ML opportunities.',
          'Tailored exclusively for Latin Americans.',
          'Connects Spanish-speaking professionals with global opportunities.',
        ],
      },
      {
        title: 'Future Plans',
        icon: faArrowRight,
        points: [
          'Expand programs to provide more opportunities for learning and growth.',
          'Increase reach across additional universities and communities.',
          'Develop advanced tools for networking and professional development.',
        ],
      }
    ],
    liveDemo: 'https://astrania.org', // Add the link to the site
  },
  {
    id: 4,
    name: 'Digital Phenotyping Algorithms',
    image: 'https://i.ibb.co/hyWgH6F/Screenshot-2024-12-28-at-4-36-12-PM.png',
    features: [
      {
        title: 'Circadian Rhythm Tracking',
        icon: faClock,
        points: [
          'Predicts sleep/wake cycles using accelerometer, light sensor, and time data.',
          'Generates probability graphs for sleep patterns and circadian rhythms.',
          'Uses a cosine model to detect circadian disruptions and phase shifts.',
        ],
      },
      {
        title: 'Sleep Prediction Models',
        icon: faBed,
        points: [
          'Idiographic model: personalized predictions based on individual sleep data.',
          'Nomothetic model: generalized predictions using pre-trained data.',
          'Neural Network architecture: 64 and 32 ReLU neurons with sigmoid output, achieving AUC-ROC = 0.9570.',
        ],
      },
      {
        title: 'Typing vs Scrolling Detection',
        icon: faKeyboard,
        points: [
          'Predicts user activity (typing vs. scrolling) with Gradient Boosted Trees and KNN classifiers.',
          'Analyzes accelerometer data to infer active/passive behavior.',
          'Improves prediction accuracy using semi-supervised learning for borderline cases.',
        ],
      },
    ],
    liveDemo: '#', // Update if there's a better link
  },
  
  
];

const PortfolioSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const length = projects.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(projects) || projects.length === 0) {
    return null;
  }

  return (
    <div className="slideshow-container">
      <div className="arrow left-arrow" onClick={prevSlide}>
        &#10094;
      </div>
      <div className="slides">
        {projects.map((project, index) => (
          <div
            className={`slide ${index === current ? 'active' : 'inactive'}`}
            key={project.id}
          >
            {index === current && (
              <div className="slide-content">
                <img src={project.image} alt={project.name} className="project-image" />
                <h2 className="project-name">{project.name}</h2>
                <div className="features">
                  {project.features.map((feature, idx) => (
                    <div className="feature-card" key={idx}>
                      <FontAwesomeIcon icon={feature.icon} size="2x" className="feature-icon" />
                      <h3 className="feature-title">{feature.title}</h3>
                      <ul className="feature-points">
                        {feature.points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="live-demo">
                  Link
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="arrow right-arrow" onClick={nextSlide}>
        &#10095;
      </div>
    </div>
  );
};

export default PortfolioSlideshow;
