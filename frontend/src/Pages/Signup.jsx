import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Puff } from "react-loader-spinner";
import "./Signup.css"; // Import the corresponding CSS file

export default function Signup() {
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
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
      .post("https://paytm-clone.onrender.com/api/v1/user/signup", formData)
      .then((res) => {
        console.log(res.data);
        const token = res.data.token;
        localStorage.setItem("token", token);
        navigate("/signin");
        setLoading(false);
      })
      .catch((err) => {
        alert(err.response.data.msg.issues[0].code);
        alert(err.response.data.msg);
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="fName" className="label">
          First Name
        </label>
        <input
          type="text"
          id="fName"
          className="input-field"
          placeholder="sarika"
          value={formData.fName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="lName" className="label">
          Last Name
        </label>
        <input
          type="text"
          id="lName"
          className="input-field"
          placeholder="Singh"
          value={formData.lName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="email" className="label">
          Your Email
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
          Your Password
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
          <Puff
            height="50"
            width="50"
            radius={1}
            color="gray"
            ariaLabel="puff-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
    </form>
  );
}