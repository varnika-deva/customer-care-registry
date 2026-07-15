import { useState, useEffect } from "react";
import axios from "axios";

function AgentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

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

  const assignToMe = async (complaintId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${complaintId}`,
        { agent: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints();
    } catch (error) {
      setMessage("Failed to assign complaint");
    }
  };

  const updateStatus = async (complaintId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${complaintId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints();
    } catch (error) {
      setMessage("Failed to update status");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", padding: "20px" }}>
      <h2>Agent Dashboard</h2>
      {message && <p>{message}</p>}

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        complaints.map((c) => (
          <div key={c._id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px", borderRadius: "5px" }}>
            <p><strong>Title:</strong> {c.title}</p>
            <p><strong>Description:</strong> {c.description}</p>
            <p><strong>Customer:</strong> {c.customer?.name} ({c.customer?.email})</p>
            <p><strong>Priority:</strong> {c.priority}</p>
            <p><strong>Assigned Agent:</strong> {c.agent ? c.agent.name : "Not assigned"}</p>

            <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                value={c.status}
                onChange={(e) => updateStatus(c._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              {!c.agent && (
                <button
                  onClick={() => assignToMe(c._id)}
                  style={{ padding: "6px 12px", backgroundColor: "#2c5f8a", color: "white", border: "none" }}
                >
                  Assign to Me
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AgentDashboard;