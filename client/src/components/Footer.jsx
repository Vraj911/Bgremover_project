import React from "react";
import { assets } from "../assets/assets";
import './css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} | All rights reserved</p>
      <div className="footer-icons">
        <img src={assets.facebook_icon} alt="Facebook" />
        <img src={assets.twitter_icon} alt="Twitter" />
        <img src={assets.google_plus_icon} alt="Google Plus" />
      </div>
    </footer>
  );
};

export default Footer;
