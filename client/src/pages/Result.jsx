import React, { useContext } from "react";
import { assets } from "../assets/assets";
import "./Result.css";
import { AppContext } from "../context/AppContext";
const Result = () => {
  const {resultImage, image}=useContext(AppContext);
  return (
    <div className="result-container">
      <div className="result-grid">
        <div className="result-item">
          <p className="result-title">Original</p>
          <img
            src={image? URL.createObjectURL(image) : ""}
            alt="Original with background"
            className="result-image"
          />
        </div>
        <div className="result-item">
          <p className="result-title green">Background Removed</p>
          <img
            src={resultImage ? resultImage : ""}
            alt="Background removed"
            className="result-image"
          />
        </div>
      </div>
      {resultImage && <div className="result-actions">
        <button>Try other image</button>
        <a href={resultImage} download>Download image</a>
      </div> }
    </div>
  );
};

export default Result;
