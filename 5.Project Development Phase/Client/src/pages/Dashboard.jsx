import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchComplaints = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(response.data);
    } catch (error) {
      setMessage("Failed to load complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/complaints",
        { title, description, customer: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setDescription("");
      setMessage("Complaint submitted successfully!");
      fetchComplaints();
    } catch (error) {
      setMessage("Failed to submit complaint");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", padding: "20px" }}>
      <h2>Welcome, {user?.name}</h2>

      <h3>Raise a Complaint</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Complaint Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <textarea
            placeholder="Describe your issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#2c5f8a", color: "white", border: "none" }}>
          Submit Complaint
        </button>
      </form>
      {message && <p>{message}</p>}

      <h3>My Complaints</h3>
      {complaints.length === 0 ? (
        <p>No complaints yet.</p>
      ) : (
        complaints.map((c) => (
          <div key={c._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
            <h4>{c.title}</h4>
            <p>{c.description}</p>
            <p><strong>Status:</strong> {c.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;