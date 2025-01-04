import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Puff } from "react-loader-spinner";
import "./Send.css";

export default function Send() {
  const [friends, setFriends] = useState("");
  const [friendArray, setFriendArray] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountToSend, setAmountToSend] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]); // Store transaction history

  const token = localStorage.getItem("token");

  // Fetch balance on component mount
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Fetch recent transactions on component mount
  useEffect(() => {
    axios
      .get("https://paytm-clone.onrender.com/api/v1/account/transactions", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setTransactions(res.data.transactions); // Assuming transactions are returned in an array
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleClick = async () => {
    try {
      const response = await axios.get(
        "https://paytm-clone.onrender.com/api/v1/user/bulk",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          params: {
            fName: friends,
          },
        }
      );

      const users = response.data.userArray;

      if (users.length > 0) {
        setFriendArray(users);
        setNoResults(false);
      } else {
        setFriendArray([]);
        setNoResults(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendClick = (friend) => {
    setSelectedFriend(friend);
    setIsModalOpen(true);
  };

  const sendTransaction = async () => {
    try {
      setLoading(true);
      await axios.post(
        "https://paytm-clone.onrender.com/api/v1/account/transact",
        { amount: parseFloat(amountToSend), to: selectedFriend?._id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      alert("Success");
      setLoading(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Transaction failed:", error);
      setLoading(false);
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="container">
      <div className="balance-box">
        <span className="balance-text">Your Balance:</span>
        <span className="balance-value">{balance}</span>
      </div>

      <h1 className="title">Search for friends</h1>
      <form className="search-form">
        <label htmlFor="default-search" className="sr-only">
          Search
        </label>
        <div className="search-box">
          <input
            type="search"
            id="default-search"
            className="search-input"
            placeholder="Search friends..."
            value={friends}
            onChange={(e) => setFriends(e.target.value)}
          />
          <button type="button" className="search-btn" onClick={handleClick}>
            Search
          </button>
        </div>
      </form>

      <div className="friends-list">
        {friendArray.length > 0 ? (
          <ul className="grid">
            {friendArray.map((friend) => (
              <li key={friend._id} className="friend-card">
                <span className="friend-name">
                  {friend.fName} {friend.lName} {String(friend._id).slice(-5)}
                </span>
                <button
                  className="send-btn"
                  onClick={() => handleSendClick(friend)}
                >
                  Send
                </button>
              </li>
            ))}
          </ul>
        ) : noResults ? (
          <p className="no-results">No results found.</p>
        ) : null}
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction._id} className="transaction-card">
                <p>
                  <strong>Date:</strong> {new Date(transaction.date).toLocaleString()}
                </p>
                <p>
                  <strong>Amount:</strong> {transaction.amount}
                </p>
                <p>
                  <strong>Recipient:</strong> {transaction.to.fName} {transaction.to.lName}
                </p>
                <p>
                  <strong>Sender:</strong> {transaction.from.fName} {transaction.from.lName}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Send Amount Modal"
        ariaHideApp={false}
        className="modal-container"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h3>
              Sending to: <span className="modal-friend">{selectedFriend?.fName}</span>
            </h3>
            <button
              type="button"
              className="close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <label>Enter Amount:</label>
            <input
              type="number"
              value={amountToSend}
              onChange={(e) => setAmountToSend(e.target.value)}
              className="amount-input"
            />
          </div>
          <div className="modal-footer">
            {!loading ? (
              <button onClick={sendTransaction} className="modal-send-btn">
                Send
              </button>
            ) : (
              <Puff color="#00BFFF" height={40} width={40} />
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="modal-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
