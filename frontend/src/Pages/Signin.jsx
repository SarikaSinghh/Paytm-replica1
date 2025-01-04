import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "../Recoil/Atoms/atom";
import { Navigate } from "react-router-dom";
import { Puff } from "react-loader-spinner";
import "./Signin.css"; // Import the corresponding CSS file

export default function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form data submitted:", formData);
    await axios
      .post("https://paytm-clone.onrender.com/api/v1/user/signin", formData)
      .then((res) => {
        console.log(res.data);
        const token = res.data.token;
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((err) => {
        alert(
          "Something Went Wrong, Please Login Again\n" + err.response.data.msg
        );
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <form className="signin-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="email" className="label">
          Your email
        </label>
        <input
          type="email"
          id="email"
          className="input-field"
          placeholder="name@sarika.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="password" className="label">
          Your password
        </label>
        <input
          type="password"
          id="password"
          className="input-field"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      {!loading ? (
        <button type="submit" className="submit-btn">
          Submit
        </button>
      ) : (
        <div className="loader-container">
          <Puff color="gray" height={50} width={50} />
        </div>
      )}
    </form>
  );
}