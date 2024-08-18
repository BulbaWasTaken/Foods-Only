import React from "react";
import profilePic from "./Images/Noah.jpg";
import "../Styles/Custom/Noah.css";  
function AboutNoah() {
  return (
    <section id="noah-profile">
      <div className="noah-image-container">
        <img src={profilePic} alt="Noah Yamsuan" className="noah-profile-image"/>
      </div>
      <div className="profile-details">
        <h1>Noah Yamsuan</h1>
        <p>Hi, My name is Noah Yamsuan! I am a 4th-year computer science major at San Francisco State University. I am the Scrum Master for this team.</p>
        <div className="details-list">
          <ul>
            <li className="detail-item">
              <span className="icon project-role-icon"><i className="fas fa-paper-plane"></i></span>
              <p className="detail-label">Project Role</p>
              <span className="detail-separator">:</span>
              <p className="detail-value">Scrum Master</p>
            </li>
            <li className="detail-item">
              <span className="icon github-icon"><i className="fab fa-github"></i></span>
              <p className="detail-label">GitHub</p>
              <span className="detail-separator">:</span>
              <a href="https://github.com/NightmareYN" target="_blank" rel="noopener noreferrer" className="github-link">NightmareYN</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default AboutNoah;
