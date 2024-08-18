import React from "react";
import "../Styles/Custom/Anshav.css";
import profilePic from "./Images/Anshav.jpg";

function AboutAnshav() {
  return (
    <body className="bodyContainer">
      <div class="anshavContainer">
        <img class="photo" src={profilePic} alt="Anshav" />

        <h1>Anshav</h1>
        <h2>Frontend Lead</h2>
        <p>
          Hi, my name is Anshav. I am majoring in Computer Science, and this is
          my last semester at SFSU. As a Frontend Lead, I am responsible for
          overseeing the development and design of user interfaces, ensuring a
          seamless and visually appealing experience for users.{" "}
        </p>
      </div>
    </body>
  );
}

export default AboutAnshav;
