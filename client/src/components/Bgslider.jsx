import React, { useState } from "react";
import { assets } from "../assets/assets";
import "./css/Bgslider.css"; 

const Bgslider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSlider = (e) => {
    setSliderPosition(e.target.value);
  };
  return (
    <div className="bgslider-container">
      <h1 className="title">Remove background with high quality accuracy</h1>
      <div className="images-wrapper">
        <img
          src={assets.image_w_bg}
          alt="With Background"
          className="image image-left"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        />
        <img
          src={assets.image_wo_bg}
          alt="Without Background"
          className="image image-right"
          style={{
            clipPath: `inset(0 0 0 ${sliderPosition}%)`,
          }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={sliderPosition}
        onChange={handleSlider}
        className="slider"
      />
    </div>
  );
};

export default Bgslider;
