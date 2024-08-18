import React from "react";
import "../Styles/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <span className="footer-title">FOODS ONLY</span>
          <span className="footer-copy">© 2024 foodsonly.app</span>
        </div>
        <div className="footer-section">
          <Link style={{textDecoration: "none"}} to="About-Us" className="footer-link">
            About Us
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
