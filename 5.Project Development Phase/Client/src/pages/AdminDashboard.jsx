import { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/complaints/stats/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      setMessage("Failed to load analytics");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div style={{ maxWidth: "700px", margin: "30px auto", padding: "20px" }}>
        <h2>Admin Dashboard</h2>
        <p>{message || "Loading..."}</p>
      </div>
    );
  }

  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    flex: "1",
    minWidth: "140px",
  };

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto", padding: "20px" }}>
      <h2>Admin Dashboard</h2>
      <h3 style={{ marginTop: "30px" }}>Ticket Overview</h3>
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "30px" }}>
        <div style={cardStyle}>
          <h2 style={{ margin: 0 }}>{stats.totalComplaints}</h2>
          <p>Total Tickets</p>
        </div>
        <div style={{ ...cardStyle, color: "orange" }}>
          <h2 style={{ margin: 0 }}>{stats.pendingCount}</h2>
          <p>Pending</p>
        </div>
        <div style={{ ...cardStyle, color: "blue" }}>
          <h2 style={{ margin: 0 }}>{stats.inProgressCount}</h2>
          <p>In Progress</p>
        </div>
        <div style={{ ...cardStyle, color: "green" }}>
          <h2 style={{ margin: 0 }}>{stats.resolvedCount}</h2>
          <p>Resolved</p>
        </div>
      </div>

      <h3>Priority Breakdown</h3>
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "30px" }}>
        <div style={{ ...cardStyle, color: "red" }}>
          <h2 style={{ margin: 0 }}>{stats.highPriority}</h2>
          <p>High Priority</p>
        </div>
        <div style={{ ...cardStyle, color: "orange" }}>
          <h2 style={{ margin: 0 }}>{stats.mediumPriority}</h2>
          <p>Medium Priority</p>
        </div>
        <div style={{ ...cardStyle, color: "green" }}>
          <h2 style={{ margin: 0 }}>{stats.lowPriority}</h2>
          <p>Low Priority</p>
        </div>
      </div>

      <h3>Customer Satisfaction</h3>
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        <div style={cardStyle}>
          <h2 style={{ margin: 0 }}>{stats.avgRating} / 5</h2>
          <p>Average Rating</p>
        </div>
        <div style={cardStyle}>
          <h2 style={{ margin: 0 }}>{stats.totalFeedbacks}</h2>
          <p>Total Feedbacks</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;