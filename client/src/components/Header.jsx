import React from "react";
import { assets } from "../assets/assets";
import './css/Header.css'; 
import { AppContext } from "../context/AppContext";
const Header = () => {
  const {removeBg} = React.useContext(AppContext);
  return (
    <div>
      <div className="header-wrapper">
        <div className="left-content">
          <h1>
            Remove the <br />
            <span>background</span> from <br />
            images for free.
          </h1>
          <input  onChange={e=>removeBg(e.target.files[0])} 
            type="file"
            id="upload1"
            className="hidden"
            accept="image/*"
          />
          <label htmlFor="upload1">
            <img src={assets.upload_btn_icon} alt="Upload" />
            <span>Upload your image</span>
          </label>
        </div>

        <div className="right-image">
          <img src={assets.header_img} alt="Header visual" />
        </div>
      </div>
    </div>
  );
};

export default Header;
