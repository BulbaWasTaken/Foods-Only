import "../Styles/AboutUs.css";

import issacPic from './Images/Issac.jpg';
import anshavPic from './Images/Anshav.jpg';
import karlPic from './Images/Karl.jpg';
import kaylaPic from './Images/Kayla.jpg';
import noahPic from './Images/Noah.jpg'; 
import terrellPic from './Images/Terrell.jpg';

function AboutUs() {
  return (
    <body className="aboutUsBody">
      <section>
      <div class="row">
        <h1>Our Team</h1>
      </div>
      <div class="row">
        
      <div class="column">
  <a href="/about-Issac" class="card-link">
    <div class="card">
      <div class="img-container">
      <img src={issacPic} alt="Issac" />
      </div>
      <h3>Issac</h3>
      <p>Team Leader</p>
    </div>
  </a>
</div>

<div class="column">
  <a href="/about-Anshav" class="card-link">
    <div class="card">
      <div class="img-container">
      <img src={anshavPic} alt="Anshav" />
      </div>
      <h3>Anshav</h3>
      <p>Front End Leader</p>
    </div>
  </a>
</div>

        
<div class="column">
  <a href="/about-Karl" class="card-link">
    <div class="card">
      <div class="img-container">
      <img src={karlPic} alt="Karl" />
      </div>
      <h3>Karl</h3>
      <p>Front/Back End Dev</p>
    </div>
  </a>
</div>


<div class="column">
  <a href="/about-Kayla" class="card-link">
    <div class="card">
      <div class="img-container">
        <img src={kaylaPic} alt="Kayla" />
      </div>
      <h3>Kayla</h3>
      <p>Github Master</p>
    </div>
  </a>
</div>


<div class="column">
  <a href="/about-Noah" class="card-link">
    <div class="card">
      <div class="img-container">
        <img src={noahPic} alt="Noah" />
      </div>
      <h3>Noah</h3>
      <p>Scrum Master</p>
    </div>
  </a>
</div>


<div class="column">
  <a href="/about-Terrell" class="card-link">
    <div class="card">
      <div class="img-container">
      <img src={terrellPic} alt="Terrell" />
      </div>
      <h3>Terrell</h3>
      <p>Back End Leader</p>
    </div>
  </a>
</div>

      </div>
    </section>
    </body>
  );
}

export default AboutUs;
