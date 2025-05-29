import React from "react";
import { assets } from "../assets/assets";
import "./Result.css";

const Result = () => {
  return (
    <div className="result-container">
      <div className="result-grid">
        <div className="result-item">
          <p className="result-title">Original</p>
          <img
            src={assets.image_w_bg}
            alt="Original with background"
            className="result-image"
          />
        </div>
        <div className="result-item">
          <p className="result-title green">Background Removed</p>
          <img
            src={assets.image_wo_bg}
            alt="Background removed"
            className="result-image"
          />
        </div>
      </div>
      <div className="result-actions">
        <button>Try other image</button>
        <a href="#" download>Download image</a>
      </div>
    </div>
  );
};

export default Result;
