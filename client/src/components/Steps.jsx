import React from "react";
import { assets } from "../assets/assets";
import './css/Steps.css'; 
const Steps = () => {
  return (
    <div className="steps-container">
      <h1 className="steps-title">
        Steps to remove background <br />
        image in seconds
      </h1>
      <div className="steps-box">
        <div className="step-item">
          <img src={assets.upload_icon} alt="Upload Icon" className="step-icon" />
          <p className="step-label">Upload image</p>
        </div>
        <div className="step-item">
          <img src={assets.remove_bg_icon} alt="Remove BG Icon" className="step-icon" />
          <p className="step-label">Remove background</p>
        </div>
        <div className="step-item">
          <img src={assets.download_icon} alt="Download Icon" className="step-icon" />
          <p className="step-label">Download image</p>
        </div>
      </div>
    </div>
  );
};

export default Steps;
