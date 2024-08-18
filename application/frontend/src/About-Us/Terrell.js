import React from "react";
import profilePic from "./Images/Terrell.jpg"; // import your image file
import "../Styles/Custom/Terrell.css";

function AboutTerrell() {
  return (
    <div className="wrapper">
      <div className="left-half">
        <div className="profile">
          <div>
            <div className="shadow">
              <div className="profile-pic">
                <img src={profilePic} alt="Terrell Enoru" />
              </div>
            </div>

            <h2>Terrell Enoru</h2>
            <h3>BACKEND LEAD</h3>
          </div>
        </div>
      </div>

      <div className="right-half">
        <h2>ABOUT ME</h2>
        <p>
          Hello my name is Terrell Enoru. I am a third year Computer Science
          major at San Francisco State who is also studying Mathematics. I am
          serving as backend lead for this project.
        </p>
      </div>
    </div>
  );
}

export default AboutTerrell;
