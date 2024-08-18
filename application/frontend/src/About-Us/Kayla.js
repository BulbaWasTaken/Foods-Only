import "../Styles/Custom/Kayla.css";
import React from "react";
import profilePic from "./Images/Kayla.jpg";
import linkedIn from "./Images/LinkedInIcon.png";


function AboutKayla() {
  return (
    <div className="section-container">
      <section className="about-kayla-profile" id="about-kayla-profile">
        <div className="about-kayla-section-pic-container">
          <img className="about-kayla-profile-picture" src={profilePic} alt="" />
          <div id="socials-container">
            <p className="social-text">Socials:</p>
            <a href="https://www.linkedin.com/in/kayla-young-0153aa240/">
              <img src={linkedIn} alt="LinkedIn Profile" className="icon" />
            </a>
          </div>
        </div>
        <div className="about-kayla-section-text-container">
          <p className="section-text-p1">Hello, I'm</p>
          <h1 className="about-kayla-title"> Kayla Young </h1>
          <p className="section-text-p2">Github Master</p>
          <h2 className="about-kayla-description">
          My name is Kayla Young, and I'm a Senior at San Francisco State
          University majoring in Computer Science. I'm the team Github Master and
          I'm responsible for overseeing all the changes made on Github.
          </h2>
        </div>
      </section>
    </div>
  );
}


export default AboutKayla;
