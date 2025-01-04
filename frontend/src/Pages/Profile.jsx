import React, { useEffect, useState } from "react"; 
import axios from "axios"; 
import { Link } from "react-router-dom"; 
import { Puff } from "react-loader-spinner"; 
import "./Profile.css"; // Import the normal CSS file 

export default function Profile() { 
  const [user, setUser] = useState({}); 
  const [balance, setBalance] = useState(0); 
  const [toggleForm, setToggleForm] = useState(false); 
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const token = localStorage.getItem("token"); 

  useEffect(() => { 
    setLoading(true); 
    axios 
      .get("https://paytm-clone.onrender.com/api/v1/user/profile", { 
        headers: { 
          Authorization: "Bearer " + token, 
        }, 
      }) 
      .then((res) => { 
        setUser(res.data.user); 
      }) 
      .catch((err) => { 
        alert(err.response.data); 
        setLoading(false); 
      }) 
      .finally(() => { 
        setLoading(false); 
      }); 
  }, [token]); 

  useEffect(() => { 
    axios 
      .get("https://paytm-clone.onrender.com/api/v1/account/balance", { 
        headers: { 
          Authorization: "Bearer " + token, 
        }, 
      }) 
      .then((res) => { 
        const bal = res.data.balance; 
        const newBal = Math.round(bal * 100) / 100; 
        setBalance(newBal); 
      }); 
  }, [token]); 

  function handleSubmit(e) { 
    e.preventDefault(); 
    axios 
      .put( 
        "https://paytm-clone.onrender.com/api/v1/user", 
        { password }, 
        { 
          headers: { 
            Authorization: "Bearer " + token, 
          }, 
        } 
      ) 
      .then((res) => { 
        alert(res.data.msg); 
      }) 
      .catch((err) => { 
        console.error(err); 
        // Handle error 
      }); 
  } 

  return ( 
    <div className="container"> 
      {!loading ? ( 
        <div className="card"> 
          <div className="profile-header"> 
            <div className="avatar-and-username"> 
              <div className="avatar"> 
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="icon" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                > 
                  <path 
                    fillRule="evenodd" 
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                    clipRule="evenodd" 
                  /> 
                </svg> 
              </div> 
              <div className="username"> 
                <p className="bold">{user.fName} {user.lName}</p> 
                <p className="profile-country">India</p> 
              </div> 
            </div> 
            <div className="nav-buttons"> 
              <Link to="/dashboard" className="button button-blue"> 
                Dashboard 
              </Link> 
              <Link to="/send" className="button button-gray"> 
                Send Money 
              </Link> 
            </div> 
          </div> 

          <div className="balance-box-container"> 
            <div className="balance-box"> 
              <div> 
                <p className="balance">₹ {balance}</p> 
                <p className="balance-label">Balance</p> 
              </div> 
            </div> 
          </div> 

          <div className="change-password-container"> 
            <button 
              className="change-password-button" 
              onClick={() => setToggleForm(true)} 
            > 
              Change Password 
            </button> 
          </div> 
          {toggleForm && ( 
            <div className="password-form-container"> 
              <form className="password-form"> 
                <label className="password-label">Enter New Password: </label> 
                <input 
                  className="password-input" 
                  onChange={(e) => setPassword(e.target.value)} 
                  type="password" 
                /> 
                <button 
                  className="password-submit-button" 
                  onClick={handleSubmit} 
                > 
                  Submit 
                </button> 
              </form> 
            </div> 
          )} 
        </div> 
      ) : ( 
        <div className="loader-container"> 
          <Puff 
            height="80" 
            width="500" 
            radius={1} 
            color="blue" 
            ariaLabel="puff-loading" 
            wrapperStyle={{}} 
          /> 
        </div> 
      )} ;
    </div> 
  ); 
} 