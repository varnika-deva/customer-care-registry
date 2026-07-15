import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const token = localStorage.getItem("token");

  const fetchComplaints = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const response = await axios.get("http://localhost:5000/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setComplaints(response.data);
    } catch (error) {
      setMessage("Failed to load complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, priorityFilter]);

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", padding: "20px" }}>
      <h2>My Complaints</h2>
      {message && <p>{message}</p>}

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {complaints.length === 0 ? (
        <p>No complaints yet.</p>
      ) : (
        complaints.map((c) => (
          <div key={c._id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px", borderRadius: "5px" }}>
            <p><strong>ID:</strong> {c._id}</p>
            <p><strong>Complaint:</strong> {c.title}</p>
            <p><strong>Date:</strong> {new Date(c.createdAt).toLocaleDateString()}</p>
            <p><strong>Priority:</strong> {c.priority}</p>
            <p style={{ color: c.status === "pending" ? "orange" : c.status === "resolved" ? "green" : "blue" }}>
              <strong>Status:</strong> {c.status}
            </p>
            {c.status === "resolved" && (
              <Link to={`/feedback/${c._id}`}>
                <button style={{ padding: "6px 12px", backgroundColor: "#2c5f8a", color: "white", border: "none", marginTop: "8px" }}>
                  Give Feedback
                </button>
              </Link>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyComplaints;