import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import SupernovaScene from './Scene'; // your scene file
import PortfolioSlideshow from './PortfolioSlideshow';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faBriefcase, faEnvelope, faHeart, faStar, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import Footer from './Footer';
import InfoBubble from './InfoBubble';


function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [particles, setParticles] = useState([]);
  const [activeBubble, setActiveBubble] = useState(null);

  const handleBubbleClick = (bubbleName) => {
    setActiveBubble(bubbleName); // Set the clicked bubble as active
  };

  const closeOverlay = () => {
    setActiveBubble(null); // Close the overlay
  };

  // Toggle function to open/close the sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const [feeds, setFeeds] = useState(0); // Local state to store the feed count
  const docRef = doc(db, "stats", "feeds"); // Firestore document reference

  // Fetch the feeds value from Firestore on initial render
  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFeeds(docSnap.data().count); // Set the local state to the Firestore value
        } else {
          // If document doesn't exist, initialize it with 0
          await setDoc(docRef, { count: 0 });
        }
      } catch (error) {
        console.error("Error fetching feeds:", error);
      }
    };

    fetchFeeds();
  }, [docRef]);

  // Handle the button click to increment the feed count
  const handleFeedClick = async () => {
    try {
      await updateDoc(docRef, {
        count: increment(1),
      });

      setFeeds((prevFeeds) => prevFeeds + 1); // Optimistically update the UI
      // Add new particles to the state
    const newParticles = Array(5)
    .fill()
    .map(() => ({
      id: Math.random(),
      icon: Math.random() > 0.5 ? faHeart : faStar,
      x: Math.random() * 100 - 100, // Random x offset
      y: Math.random() * 100 - 200, // Random y offset
    }));

    setParticles([...particles, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles((prev) => prev.slice(newParticles.length));
    }, 2000);
    
    } catch (error) {
      console.error("Error updating feeds:", error);
    }
  };

  return (
    <div class="outer">
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul>
          <li><a href="#">Home</a></li>
          <li><button onClick={() => handleBubbleClick("About")}>About</button></li>
          <li><button onClick={() => handleBubbleClick("Portfolio")}>Portfolio</button></li>
          <li><button onClick={() => handleBubbleClick("Contact")}>Contact</button></li>
        </ul>
        <button className="sidebutton toggle-button special" onClick={toggleSidebar}>
          {isOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button>
      </nav>

      <SupernovaScene />
      {/* 
        You can also place normal HTML content on top of the canvas 
        (e.g. a navigation bar or a personal bio) using absolute positioning 
        or a separate layout. 
      */}
      <div class="mobilehero" style={{
        position: 'absolute',
        top: '70%',
        width: '100%',
        textAlign: 'center',
        display: 'none'
      }}>
        <h1>Ariadne (Ari) Dulchinos</h1>
        <p style={{color: 'white'}}>Masters @ MIT CS<br/></p>
        <button class="special" onClick={() => handleBubbleClick("Contact")}>Contact</button>
        <h3 style={{color: 'white'}}><FontAwesomeIcon icon={faAngleDown} /></h3>
      </div>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`} style={{
        position: 'absolute',
        top: 50,
        left: 0,
        bottom: 0,
        color: '#ffffff',
        zIndex: 999,
        width: '300px',
        overflowY: 'scroll',
        background: 'rgb(0,0,0)', /* Fallback for older browsers */
        background: '-moz-linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)', /* Firefox */
        background: '-webkit-linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)', /* Chrome, Safari */
        background: 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)', /* Modern browsers */
        filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#000000",endColorstr="#000000",GradientType=1)' /* IE */

      }}>

        <div class="desktophero" style={{padding: '20px 30px'}}>
        <h1>Ariadne (Ari) Dulchinos</h1>
        <p>Masters @ MIT CS</p>
        <p>Bachelors @ MIT CS</p>
        <br/>
        <button class="special" onClick={() => handleBubbleClick("Contact")}>Contact</button>
        </div>

        <div style={{padding: '20px 30px'}}>
          <h3>RESEARCH INTERESTS</h3>
          <div class="divider"></div>
          <div class="featurebox"><span class="glow"><FontAwesomeIcon icon={faHome} /> Digital Phenotyping</span> Smartphone/Wearable driven mobile-compatible ML models for Mental Health & Sleep</div>
          <div class="featurebox"><span class="glow"><FontAwesomeIcon icon={faInfoCircle} /> Neural Signal Processing</span> & Data Analysis</div>
          <div class="featurebox"><span class="glow"><FontAwesomeIcon icon={faBriefcase} /> Explainable AI</span> (XAI) in Biomedical Applications</div>
          <div class="featurebox"><span class="glow"><FontAwesomeIcon icon={faEnvelope} /> Climate</span> & Environmental Justice</div>
        </div>
      </div>
      <div className={`bubbleholder ${isOpen ? 'open' : 'closedbottom'}`} style={{
        position: 'absolute',
        left: 320,
        bottom: 20,
        right: 320,
        height: '120px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="bubble" onClick={() => handleBubbleClick("Professional")}>
          <img
            className="bubbleicon"
            src="https://i.ibb.co/wrs0bfj/Screenshot-2024-12-27-at-11-06-52-PM.png"
            alt="Professional"
          />
          <h4>Professional</h4>
        </div>
        <div className="bubble" onClick={() => handleBubbleClick("Publications")}>
          <img
            className="bubbleicon"
            src="https://i.ibb.co/0yYQwv8/Screenshot-2024-12-27-at-11-06-04-PM.png"
            alt="Publications"
          />
          <h4>Publications</h4>
        </div>
        <div className="bubble" onClick={() => handleBubbleClick("Research")}>
          <img class="bubbleicon" src="https://i.ibb.co/bmxMMss/Screenshot-2024-12-27-at-11-06-20-PM.png"/>
          <h4>Research</h4>
        </div>
        <div className="bubble" onClick={() => handleBubbleClick("Awards")}>
          <img class="bubbleicon" src="https://i.ibb.co/F7LfC5F/Screenshot-2024-12-27-at-11-07-02-PM.png"/>
          <h4>Awards</h4>
        </div>
        <div className="bubble" onClick={() => handleBubbleClick("Teaching")}>
          <img class="bubbleicon" src="https://i.ibb.co/jJCMQQy/Screenshot-2024-12-27-at-11-07-38-PM.png"/>
          <h4>Teaching</h4>
        </div>
        <div className="bubble" onClick={() => handleBubbleClick("Portfolio")}>
          <img class="bubbleicon" src="https://i.ibb.co/F4gnMPZ/Screenshot-2024-12-27-at-11-07-50-PM.png"/>
          <h4>Portfolio</h4>
        </div>
      </div>

      <div className={`aboutcard ${isOpen ? 'open' : 'closedright'}`} style={{
        position: 'absolute',
        top: 65,
        right: 20,
        bottom: 20,
        overflowY: 'scroll'
        }}>
          <br/>
          <div class="centerize">
            <a href="https://www.linkedin.com/in/ariadnedulchinos/"><span class="circleicon pink"><FontAwesomeIcon icon={faLinkedin} /></span></a>
            <a href="https://github.com/AriadneD?tab=repositories"><span class="circleicon blue"><FontAwesomeIcon icon={faGithub} /></span></a>
            <a href="https://x.com/rediscoding"><span class="circleicon purple"><FontAwesomeIcon icon={faTwitter} /></span></a>
            <a href="mailto:arid@mit.edu"><span class="circleicon pink"><FontAwesomeIcon icon={faEnvelope} /></span></a>
          </div>
        
        <br/><br/>
        <div class="divider"></div>
        <br/>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
          }}>
        
            <img
            src="https://i.ibb.co/XSv28S7/Screenshot-2024-12-27-at-11-12-01-AM.png"
            className="pfp"
            alt="Profile"
          />
          <div className="chatbox">
            <p>
              Feed me cyber-grapes{" "}
              <span style={{ color: "red" }}>
                <FontAwesomeIcon icon={faHeart} />
              </span>
            </p>
            <button onClick={handleFeedClick} className="feed-button">
              {feeds} Feeds
            </button>
          </div>

          {/* Render particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                top: "50%",
                left: "50%",
                transform: `translate(${particle.x}px, ${particle.y}px)`,
                color: particle.icon === faHeart ? "red" : "gold",
              }}
            >
              <FontAwesomeIcon icon={particle.icon} />
            </div>
          ))}

          

        </div>
        
        <h3>SKILLS</h3>

        <div class="skills">
          <div class="skillcont">
            <p>Machine Learning</p>
            <div class="progress-bar">
              <div class="progress progress90"></div>
            </div>
          </div>
          <div class="skillcont">
            <p>Data Visualization</p>
            <div class="progress-bar">
              <div class="progress progress90"></div>
            </div>
          </div>
          <div class="skillcont">
            <p>Web & Mobile UI/UX</p>
            <div class="progress-bar">
              <div class="progress progress90"></div>
            </div>
          </div>
          <div class="skillcont">
            <p>Natural Language Processing</p>
            <div class="progress-bar">
              <div class="progress progress85"></div>
            </div>
          </div>
          <div class="skillcont">
            <p>iOS Development</p>
            <div class="progress-bar">
              <div class="progress progress80"></div>
            </div>
          </div>
          <div class="skillcont">
            <p>Signal Processing</p>
            <div class="progress-bar">
              <div class="progress progress75"></div>
            </div>
          </div>
          <div class="skillcont">
            <p>Full-Stack Web Development</p>
            <div class="progress-bar">
              <div class="progress progress75"></div>
            </div>
          </div>
          <div class="skillcont">
            <p>Cloud & API Services</p>
            <div class="progress-bar">
              <div class="progress progress70"></div>
            </div>
          </div>
        </div>
        <br/>
        <h3>ALL SKILLS</h3>
        <div class="tags-container">
          <div class="tag programming">HTML</div>
          <div class="tag programming">CSS</div>
          <div class="tag programming">JavaScript</div>
          <div class="tag programming">Python</div>
          <div class="tag programming">Java</div>
          <div class="tag programming">Swift</div>
          <div class="tag programming">MATLAB</div>
          <div class="tag programming">SQL</div>
          <div class="tag programming">PostgreSQL</div>
          <div class="tag programming">MySQL</div>
          <div class="tag programming">Node.js</div>
          <div class="tag programming">Express</div>
          <div class="tag programming">Vue</div>
          <div class="tag programming">React</div>
          <div class="tag programming">Leaflet.js</div>
          <div class="tag programming">Flask</div>
          <div class="tag programming">GitHub</div>
          <div class="tag programming">Firebase</div>
          <div class="tag programming">PHP</div>
          <div class="tag programming">GML (Game Development)</div>

          <div class="tag ml">TensorFlow</div>
          <div class="tag ml">PyTorch</div>
          <div class="tag ml">Scikit-Learn</div>
          <div class="tag ml">Natural Language Processing (NLP)</div>
          <div class="tag ml">Signal Processing</div>

          <div class="tag research">Digital Phenotyping</div>
          <div class="tag research">Bioinformatics</div>
          <div class="tag research">Lab Safety</div>
          <div class="tag research">Paper Writing</div>
          <div class="tag research">Medical Imaging (EEG, fMRI)</div>

          <div class="tag language">English (Native)</div>
          <div class="tag language">Spanish (Native)</div>
          <div class="tag language">Korean (Basic)</div>
          <div class="tag language">Chinese (Basic)</div>

        </div>
        
        
        
      </div>
      

      
      
      {/* Overlay Section */}
      {activeBubble && (
        <div
          className="overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            
          }}
        >
          <div
            style={{
              backgroundColor: "#333",
              color: "#fff",
              padding: "20px",
              borderRadius: "10px",
              
              width: "90%",
              textAlign: "left",
              position: "absolute",
              top: 20,
              bottom: 20,
            }}
          >
            <div style={{
              height: "100%",
              overflowY: "scroll"
              }}>


            {activeBubble === "Professional" && (
                          <div>
                            <h3>Professional Experience</h3>
                            <p>
                              <strong>Ourobionics, Wageningen, The Netherlands</strong> — <i>Jun 2024 – Present</i>
                            </p>
                            <p>Machine Learning Engineer</p>
                            <p>
                              Developed an explainable AI algorithm optimizing PVA fiber electrospinning for 3D bioprinting, reducing feature selection time by 95%. Work accepted for 2025 Nature Conference.
                            </p>

                            <p>
                              <strong>Civicom Aid, Mombasa, Kenya</strong> — <i>Aug 2023 – Sep 2023</i>
                            </p>
                            <p>Machine Learning Engineer</p>
                            <p>
                              Designed a geo-statistical model to predict mosquito risk epicenters using Gaussian models and ML algorithms. Developed an interactive web app using Leaflet.js and Flask.
                            </p>
                            <p>
                              <strong>Apple, Cupertino, CA</strong> — <i>Jun 2023 – Aug 2023</i>
                            </p>
                            <p>Engineering Project Management Intern</p>
                            <p>
                              Designed, gathered requirements, and implemented system diagnostics dashboards
                              in Splunk and Tableau.
                            </p>
                            <p>
                              <strong>Microsoft, Bellevue, WA</strong> — <i>Nov 2022 – Feb 2023</i>
                            </p>
                            <p>AI Product Management Intern</p>
                            <p>
                              Developed intelligent search enhancement concepts using Figma, conducted
                              competitive analysis, and presented a 60-page strategy report to senior leadership,
                              driving AI-based product innovation.
                            </p>
                            <p>
                              <strong>Apple, Cupertino, CA</strong> — <i>Jun 2022 – Aug 2022</i>
                            </p>
                            <p>Engineering Project Management Intern</p>
                            <p>
                              Selected as 1 of 10 finalist teams to pitch a feature. Presented project results to Apple's Senior VP of SWE and secured participation from 40+ project leads.
                            </p>
                            <p>
                              <strong>Leading with Our Values</strong> — <i>Oct 2021 – Jun 2022</i>
                            </p>
                            <p>Program Manager</p>
                            <p>
                              Launched a press conference with 100+ attendees, including US senators and public officials. Implemented a collaboration platform improving team responsiveness by 80%.
                            </p>
                            <p>
                              <strong>Microsoft</strong> — <i>Jun 2021 – Aug 2021</i>
                            </p>
                            <p>New Technologist Intern</p>
                            <p>
                              Developed a web app in React and Fluent UI to improve healthy food accessibility. Conducted user research with 30+ users and presented to the Corporate VP.
                            </p>

                          </div>
                        )}
                        {activeBubble === "Publications" && (
                          <div>
                            <h3>Publications</h3>

                            <ul>
                              <li>
                                <strong>Dulchinos, A.</strong>, Shoushtari, A., Gray, S. 
                                <i> Materials for AI, AI for Materials </i> (2025, Daejon, SK). 
                                <em>(Conference/Poster Paper - Coming Soon)</em>
                              </li>
                              <li>
                                <strong>Dulchinos, A.</strong>, Edwin Ouko, Sabrina Do, Valerie Kwek, Somaia Saba, Richard Fletcher. 
                                <i> Empowering Student Wellbeing Through Technology: Insights from a Digital Phenotyping Study on Stress and Sleep Quality. </i> 
                                UROP Summaries MURJ Volume 48, Fall 2024.
                              </li>
                              <li>
                                Do, S., Kwek, V., Saba, S., <strong>Dulchinos, A.</strong>, Fletcher, R. 
                                <i> MobilePath: A Mobile Server Platform for Health and Behavior Monitoring. </i> 
                                MIT Undergraduate Research Journal, 45 (2023).
                              </li>
                            </ul>
                            <h3>Press Mentions</h3>
                            <ul style={{
                              listStyleType: "none",
                            }}>
                              <li class="featurebox">
                                <img src="https://i.ibb.co/XjJ2d0s/1732550431241.jpg" alt="MIT CAPD Thumbnail" width="100" />
                                <br/>
                                <a href="https://capd.mit.edu/blog/2024/10/16/my-experience-with-mits-career-exploration-fellowship-machine-learning-with-biomedical-applications-at-ourobionics/" target="_blank" rel="noopener noreferrer">
                                  My Experience with MIT's Career Exploration Fellowship - MIT CAPD Blog
                                </a>
                                <br />
                                <a href="https://www.linkedin.com/feed/update/urn:li:activity:7266882174497308674/" target="_blank" rel="noopener noreferrer">
                                  LinkedIn Post
                                </a>
                              </li>
                              <li class="featurebox">
                                <img src="https://i.ibb.co/dBBzrp4/1731596082689.jpg" alt="Massachusetts AI Ecosystem Thumbnail" width="100" />
                                <br/>
                                <a href="https://www.linkedin.com/feed/update/urn:li:activity:7262875108740849664/" target="_blank" rel="noopener noreferrer">
                                  Massachusetts AI Ecosystem
                                </a>
                              </li>
                              <li class="featurebox">
                                <img src="https://i.ibb.co/JtjbQ22/Screenshot-2024-12-28-at-11-04-41-AM.png" alt="Explore AI Thumbnail" width="100" />
                                <br/>
                                <a href="https://www.linkedin.com/posts/serena-yu87_shaping-the-future-of-digital-health-with-ugcPost-7188948677904760834-pm3w?utm_source=share&utm_medium=member_desktop" target="_blank" rel="noopener noreferrer">
                                  Shaping the Future of Digital Health with Serena Yu
                                </a>
                              </li>
                              <li class="featurebox">
                                <img src="https://i.ibb.co/LRdXYjQ/Screenshot-2024-12-28-at-11-06-24-AM.png" alt="Entertainment Software Association Thumbnail" width="100" />
                                <br/>
                                <a href="https://esafoundation.org/an-exceptional-celebration/" target="_blank" rel="noopener noreferrer">
                                  An Exceptional Celebration - ESA Foundation
                                </a>
                                <br />
                                <a href="https://www.youtube.com/watch?v=1e-qRrah-O0" target="_blank" rel="noopener noreferrer">
                                  YouTube Video
                                </a>
                              </li>
                              <li class="featurebox">
                                <img src="https://i.ibb.co/vzdB4bM/Screenshot-2024-12-28-at-11-09-23-AM.png" alt="Amazon Publications Thumbnail" width="100" />
                                <br/>
                                <a href="https://www.amazon.com/Books-Ariadne-Dulchinos/s?rh=n%3A283155%2Cp_27%3AAriadne%2BDulchinos" target="_blank" rel="noopener noreferrer">
                                  Ariadne Dulchinos - Amazon Author Page
                                </a>
                              </li>
                              <li class="featurebox">
                                <img src="https://i.ibb.co/9NM0KhS/Screenshot-2024-12-28-at-11-13-44-AM.png" alt="Congressional App Challenge Thumbnail" width="100" />
                                <br/>
                                <a href="https://www.congressionalappchallenge.us/2018-ri1/" target="_blank" rel="noopener noreferrer">
                                  Congressional App Challenge - 2018 RI Winner
                                </a>
                              </li>
                            </ul>


                          </div>
                        )}
                        {activeBubble === "Research" && (
                          <div>
                            <h3>Research Experience</h3>
                            <p>
                              <strong>MIT Computer Science and Artificial Intelligence Lab (CSAIL), Cambridge, MA</strong> — <i>Sep 2023 – Dec 2023</i>
                            </p>
                            <p>Machine Learning Researcher</p>
                            <p>
                              Engineered a PyTorch-based multivariable regression model for neural scene reconstruction using multimodal data, achieving a loss less than 0.1 across all configurations.
                            </p>

                            <p>
                              <strong>Massachusetts Institute of Technology, Cambridge, MA</strong> — <i>Jan 2023 – Present</i>
                            </p>
                            <p>Machine Learning Researcher</p>
                            <p>
                              Developed on-device digital phenotyping algorithms for circadian rhythm detection, interaction dynamics, and heart rate analysis, leveraging Bayesian networks, FFT, and Random Forests. Contributed to a publication in the MIT Undergraduate Research Journal.
                            </p>

                            <p>
                              <strong>The Warren Alpert Medical School of Brown University, Providence, RI</strong> — <i>Nov 2018 – Mar 2020</i>
                            </p>
                            <p>Software Engineer, Researcher</p>
                            <p>
                              Built a chromosome visualization software for cytogenetic data, integrating 20,000+ genes from UCSC Genome Browser, awarded the Naval Undersea Warfare Innovation Award and First Grant at the RI Science and Engineering Fair.
                            </p>

                            <p>
                              <strong>MIT Media Lab, Cambridge, MA</strong> — <i>Jan 2021 – Mar 2021</i>
                            </p>
                            <p>Full Stack Engineer</p>
                            <p>
                              Designed a web app for sustainable city planning with real-time visualization of large datasets, presented at the MIT Media Lab Winter 2022 Research Symposium.
                            </p>

                            <p>
                              <strong>iCreate Makerspace Lab, Barrington, RI</strong> — <i>Dec 2016 – Apr 2020</i>
                            </p>
                            <p>Co-Founder, Program Manager</p>
                            <p>
                              Co-founded a makerspace attended by 100+ students weekly, attracting statewide press and a gubernatorial visit. Developed a website using HTML/CSS/JS and secured grant funding as a board member of the FUZE architect program.
                            </p>

                            <p>
                              <strong>MIT SHASS Radio, Cambridge, MA</strong> — <i>Sep 2020 – Dec 2020</i>
                            </p>
                            <p>Undergraduate Researcher, Podcast Co-Host</p>
                            <p>
                              Researched and co-produced a podcast on indigenous activism and mining industries with 10 students and MIT faculty, published through MIT SHASS Radio.
                            </p>

                            <p>
                              <strong>The Warren Alpert Medical School of Brown University, Providence, RI</strong> — <i>Nov 2018 – Aug 2020</i>
                            </p>
                            <p>Research Assistant</p>
                            <p>
                              Integrated genomic data from UCSC Genome Browser into idiogram formats for 20,000+ genes. Contributed to lab procedures and collaborative research discussions on molecular pharmacology.
                            </p>

                          </div>
                        )}
                        {activeBubble === "Awards" && (
                          <div>
                            <h3>Awards & Scholarships</h3>
                            <ul>
                              <li>National Merit Scholar</li>
                              <li>National Hispanic Scholar</li>
                              <li>Entertainment Software Association Foundation Computer and Video Game Arts and Sciences Scholar</li>
                              <li>Two-time Congressional App Challenge Winner</li>
                              <li>Voice of Democracy Essay Contest Winner</li>
                              <li>Naval Undersea Warfare College Innovation Award</li>
                              <li>RI Science and Engineering Fair 1st Grant Winner</li>
                              <li>Education is Quay Scholar</li>
                              <li>2x Hackathon Top-3</li>
                              <li>MIT Sustainability Award</li>
                              <li>MIT Career Exploration Fellow</li>
                              <li>4x Future Business Leaders of America Business Achievement Award</li>
                            </ul>
                          </div>
                        )}
                        {activeBubble === "Teaching" && (
                          <div>
                            <h3>Teaching Experience</h3>
                            <p>
                              <strong>MIT Career Advising & Professional Development Office</strong> — <i>Sep 2024 – Present</i>
                            </p>
                            <p>Peer Career Advisor</p>
                            <p>
                              Provide guidance to MIT students on resume and cover letter writing, interview preparation, career strategies, and graduate school applications.
                            </p>

                            <p>
                              <strong>MIT Global Startup Labs, Montevideo, Uruguay</strong> — <i>Jan 2022 – Feb 2022</i>
                            </p>
                            <p>Business Instructor</p>
                            <p>
                              Conducted pitch design workshops in English and Spanish, preparing 30+ Uruguayan MIT Masters students to pitch machine learning startup ideas; top 3 teams secured angel funding. Designed and taught a marketing workshop, enabling all teams to develop professional landing pages.
                            </p>

                            <p>
                              <strong>LAVNER Camps & Programs</strong> — <i>Jul 2020 – Aug 2020</i>
                            </p>
                            <p>Technology Instructor</p>
                            <p>
                              Taught Web Design Academy, Game Development with GameMaker, and Digital Art classes, equipping students with technical and creative skills.
                            </p>

                            <p>
                              <strong>Inspiring Minds</strong> — <i>Jun 2019 – Aug 2020</i>
                            </p>
                            <p>Academic Instructor</p>
                            <p>
                              Mentored URM preschool-aged children in academic and holistic activities, including arts, arithmetic, and literacy, in a bilingual classroom setting. Planned enrichment activities and facilitated communication between students and teachers to improve engagement.
                            </p>

                          </div>
                        )}
                        {activeBubble === "Portfolio" && (
                          <div>
                            <PortfolioSlideshow />
                          </div>
                        )}
                        {activeBubble === "About" && (
                          <div>
                            <h3>About</h3>
                            <div class="about-me">
                            <p>
                              Hi there! 👋 I'm Ariadne, but you can call me Ari. I'm a passionate innovator at the intersection of AI, health tech, and sustainability.
                              By day, I’m a tech enthusiast building solutions that make a difference, and by night, you’ll probably find me exploring new ideas, mentoring,
                              or geeking out over the latest advancements in AI.
                            </p>
                            <p>
                              I love creating tools that empower people, whether it’s helping Latin American students learn about AI through 
                              <a href="https://astrania.org" target="_blank">Astrania</a>, building apps that improve mental health, or mentoring budding entrepreneurs.
                              If there’s a challenge, I’m ready to tackle it with creativity and purpose.
                            </p>
                            <p>
                              Beyond the code, I’m a pescatarian who loves Asian and American food, a multilingual adventurer (English, Spanish, and dabbling in Korean/Chinese),
                              and a firm believer in the power of technology to create a more equitable world.
                            </p>
                            <p>
                              Let’s connect and make something amazing together. 😊
                            </p>
                          </div>

                          </div>
                        )}
                        {activeBubble === "Contact" && (
                          <div style={{width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                          }}>
                          <div style={{maxWidth: '600px'}}>
                            <h3>Contact</h3>
                            <p>
                              Got a question, an idea, or just want to say hi? I’d love to hear from you! 😎
                              Feel free to reach out to me at 
                              <div class="featurebox">
                              <strong>arid (at) mit (dot) edu</strong>
                              </div>
                              <div class="featurebox">
                              <strong>rediscoding on X (Twitter)</strong>
                              </div>
                            </p>
                          </div>
                          </div>
                        )}


            </div>
            <button
              onClick={closeOverlay}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                backgroundColor: "transparent",
                color: "#fff",
                fontSize: "24px",
                border: "none",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            
          </div>
        </div>
      )}

      <InfoBubble />
      
      <Footer handleBubbleClick={handleBubbleClick} />
      
      
    </div>
  );
}

export default App;
