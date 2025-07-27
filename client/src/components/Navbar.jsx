import React, { useEffect } from "react";
import { assets } from '../assets/assets';
import { Link,useNavigate } from "react-router-dom";
import './css/Navbar.css'; 
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { AppContext } from "../context/AppContext"; 
const Navbar = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn, user } = useUser();
  const {credit,loadCreditsData} = React.useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (isSignedIn) {
      loadCreditsData();
    }
  }, [isSignedIn]);
  return (
    <nav className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>
      {
        isSignedIn ? (
          <div>
          <button onClick={()=>{navigate('/buy')}}><img src={assets.credit_icon}/>
          <p>Credits: {credit}</p></button>
          <p>Hi, {user.fullName}</p>
            <UserButton />
          </div>
        ) : (
          <button onClick={() => openSignIn({})}>
            Get Started
            <img src={assets.arrow_icon} alt="Arrow Icon" />
          </button>
        )
      }
    </nav>
  );
};

export default Navbar;
