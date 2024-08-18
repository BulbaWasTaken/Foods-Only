import "../Styles/Custom/Karl.css";
import React from "react";
import profilePic from "./Images/Karl.jpg";
import github from "./Images/GithubIcon.png";

function AboutKarl() {
  return (
    <div className="section-container">
      <section className="about-karl-profile" id="about-karl-profile">
        <div className="about-karl-section-pic-container">
          <img className="about-karl-profile-picture" src={profilePic} alt="" />
          <div id="socials-container">
            <p className="social-text">Social:</p>
            <a href="https://github.com/BulbaWasTaken">
              <img src={github} alt="My github account" className="icon" />
            </a>
          </div>
        </div>
        <div className="about-karl-section-text-container">
          <p className="section-text-p1">Hello, I'm</p>
          <h1 className="about-karl-title"> Karl Arcilla </h1>
          <p className="section-text-p2">Backend/Frontend Developer</p>
          <h2 className="about-karl-description">
            A senior studying Computer Science at San Francisco State
            University. For this project, my roles are to help with backend and
            frontend, and to manage Cloudinary database.
          </h2>
        </div>
      </section>
    </div>
  );
}

export default AboutKarl;
