import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RaiseComplaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Please login first");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/complaints",
        { title, description, priority, customer: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Complaint submitted successfully!");
      setTitle("");
      setDescription("");
      setPriority("medium");
      setTimeout(() => navigate("/my-complaints"), 1000);
    } catch (error) {
      setMessage("Failed to submit complaint");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
      <h2>Write Your Complaint</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Title</label><br />
          <input
            type="text"
            placeholder="Enter complaint title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Complaint Details</label><br />
          <textarea
            placeholder="Describe your complaint here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="5"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Priority</label><br />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#2c5f8a", color: "white", border: "none" }}>
          Submit
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RaiseComplaint;