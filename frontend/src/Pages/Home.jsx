import React from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "../Recoil/Atoms/atom";
import "./Home.css"; // Link the CSS file

export default function Home() {
  const [isLoggedIn] = useRecoilState(isLoggedInAtom);

  return (
    <section className="home-section">
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">
            <span className="text-sky">The Most Reliable</span><br />
            <span className="text-blue">UPI Payment App in the Country</span>: Empowering Digital Transactions for a Seamless Tomorrow
          </h1>
          <p className="home-description">
            With the Paytm App, Transfer Funds or Pay anyone without a worry in the world. It is convenient with built-in safety features & easy access to your account balance & payment history.
          </p>
          {!isLoggedIn ? (
            <Link to="/signin" className="signin-btn">
              Sign In
            </Link>
          ) : (
            <Link to="/dashboard" className="dashboard-btn">
              Go to Dashboard
            </Link>
          )}
        </div>
        <div className="home-image">
          <img
            src="https://assetscdn1.paytm.com/images/catalog/view_item/763078/1617607417699.png"
            alt="Paytm Logo"
            className="logo-img"
          />
        </div>
      </div>

      {/* New Section for Paytm Features */}
      <div className="features-section">
        <h2 className="features-heading">Why Choose Paytm?</h2>
        <div className="features-container">
          <div className="feature">
            <img
              src="https://pwebassets.paytm.com/commonwebassets/commonweb/images/instore-payments/instore-banner-1.png"
              alt="QR Code Payments"
              className="feature-img"
            />
            <h3 className="feature-title">QR Code Payments</h3>
            <p className="feature-description">
              Paytm enables quick and easy payments using QR codes. Just scan and pay with your phone!
            </p>
          </div>
          <div className="feature">
            <img
              src="https://assetscdn1.paytm.com/images/catalog/view_item/728702/1626342071104.png"
              alt="Fast Transfers"
              className="feature-img"
            />
            <h3 className="feature-title">Fast Transfers</h3>
            <p className="feature-description">
              Transfer money instantly to anyone, anytime, with just a few taps.
            </p>
          </div>
          <div className="feature">
            <img
              src="https://pwebassets.paytm.com/commonwebassets/commonweb/images/payment-rewards/rewards.png"
              alt="Online Shopping"
              className="feature-img"
            />
            <h3 className="feature-title">Online Shopping</h3>
            <p className="feature-description">
              Explore a wide range of products and enjoy seamless shopping with Paytm Mall.
            </p>
          </div>
        </div>
      </div>

      {/* New Section for Paytm Safety & Security */}
      <div className="security-section">
        <h2 className="security-heading">Your Safety, Our Priority</h2>
        <p className="security-description">
          Paytm provides secure payment methods, ensuring your transactions are safe, encrypted, and protected.
        </p>
        <img
          src="https://media.istockphoto.com/id/1252910501/photo/phone-security-personal-data-protection-safety-3d-render.jpg?s=612x612&w=0&k=20&c=b6E73hLbxj7KhA4nd3eqWO4_ipj3as6hSokI928Npvo="
          alt="Paytm Security"
          className="security-img"
        />
      </div>
    </section>
  );
}
