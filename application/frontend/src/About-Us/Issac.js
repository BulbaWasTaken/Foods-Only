import React from "react";
import profilePic from "./Images/Issac.jpg";
import "../Styles/Custom/Issac.css";

function AboutIssac() {
  return (
    <body className="issacBody">
      <div className="issacContainer">
        <div class="item">
          <img src={profilePic} alt="Issac Moreno" />
          <h1>Issac Moreno</h1>
        </div>
        <h2 class="item">Team Lead</h2>
        <p class="item">
          Hi! My name is Issac. I am a third-year, Computer Science major at
          SFSU, where I am also studying computer engineering and mathematics. I
          currently serve as the team leader for this project. Together, our
          team aims to develop and engineer a web application that serves a
          meaningful purpose for its users.
        </p>
        <div class="item">
          <h2>Get to know me!</h2>
          <div className="social-links">
            <a
              class="item"
              href="https://www.linkedin.com/in/issac-m-b605391b1/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              class="item"
              href="https://github.com/crvelworld"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </a>
          </div>
        </div>
      </div>
    </body>
  );
}

export default AboutIssac;
