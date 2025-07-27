import React from "react";
import { assets, plans } from "../assets/assets";
import "./BuyCredits.css";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
const BuyCredits = () => {
  const {loadCreditsData}=useContext(AppContext); 
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate=useNavigate();
  const getToken = useAuth();
  const {user} =useUser();
  const initpay=async (order)=>{
      const options = {

        key: process.env.VITE_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: "Bgremover",  
        description: "Purchase Credits",
        order_id: order.id,
        receipt:order.receipt,
        handler: async (response) => {
          console.log("Payment response:", response); 
        }
  }
  const rzp=new window.Razorpay(options);
  rzp.open(); 
}
 const paymentRazorpay = async (planId) => {
  try {
    const token = await getToken.getToken();
    if (!token) {
      toast.error("Please login to continue");
      return;
    }

    const clerkId = user?.id;
    if (!clerkId) {
      toast.error("Unable to fetch user ID");
      return;
    }

    const { data } = await axios.post(
      `${backendUrl}/api/user/pay-razor`,
      { planId, clerkId },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    if (data.success) {
      initpay(data.order);
    }

  } catch (error) {
    console.error("Error in paymentRazorpay:", error);
    toast.error("Internal server error");
  }
};

  return (
    <div className="buy-credits-container">
      <button className="buy-credits-button">Our plans</button>
      <h1 className="buy-credits-header">Choose plan</h1>
      <div className="buy-credits-plans">
        {plans.map((item, index) => (
          <div className="plan-card" key={index}>
            <img
              src={assets.logo_icon}
              className="plan-logo"
              alt="logo"
            />
            <p className="plan-id">{item.id}</p>
            <p className="plan-desc">{item.desc}</p>
            <div className="plan-price">${item.price}</div>
<div className="plan-credits">/ {item.credits} credits</div>
            <button onClick={()=>paymentRazorpay(item.id)} className="buy-button">Buy</button>
          </div>
        ))}
      </div>
    
    </div>
  );
};

export default BuyCredits;