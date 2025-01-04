import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { Line } from "react-chartjs-2"; // Importing Line graph component
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"; 
import "./Dashboard.css";

// Registering required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState([]); // State to store data for the graph
  const token = localStorage.getItem("token");

  if (!token) {
    return <div> Invalid token, Please Logout and Login again</div>;
  }

  useEffect(() => {
    setLoading(true);
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
        setLoading(false);

        // Fetch graph data if needed (for example purposes, random data here)
        const sampleGraphData = [100, 200, 150, 300, 250]; // Replace this with actual data
        setGraphData(sampleGraphData); // Set graph data from API
      })
      .catch((err) => {
        setLoading(false);
        alert("Something Went Wrong, please Login Again \n" + err);
      });
  }, []);

  // Prepare data for the line graph
  const data = {
    labels: ["January", "February", "March", "April", "May"], // These could be months or dates
    datasets: [
      {
        label: "Balance Over Time",
        data: graphData, // Graph data pulled from state
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <section className="dashboard-section">
      <div className="dashboard-container">
        <div className="dashboard-text">
          <h2 className="dashboard-balance">
            Your Current Balance is <br />
            {!loading ? (
              <span className="balance-amount">
                <span className="currency">₹</span> {balance}
              </span>
            ) : (
              <div className="loading-indicator">
                <Oval
                  visible={true}
                  height="30"
                  width="30"
                  color="blue"
                  secondaryColor="blue"
                  ariaLabel="oval-loading"
                />
              </div>
            )}
          </h2>
          <p className="dashboard-description">
            Send money to anyone, instantly. No matter where it is.
          </p>
          <Link className="send-money-btn" to="/send">
            Send Money
            <svg
              className="send-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
          <Link className="profile-btn" to="/profile">
            Go to Profile
          </Link>

          {/* Line chart for graph */}
          <div className="graph-container">
            <Lin-e data={data} />
          </div>
        </div>
      </div>
    </section>
  );
}
