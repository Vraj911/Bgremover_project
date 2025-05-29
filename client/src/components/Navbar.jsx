import React from "react";
import { assets } from '../assets/assets';
import { Link } from "react-router-dom";
import './css/Navbar.css'; 
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn, user } = useUser();

  return (
    <nav className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>
      {
        isSignedIn ? (
          <div>
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
