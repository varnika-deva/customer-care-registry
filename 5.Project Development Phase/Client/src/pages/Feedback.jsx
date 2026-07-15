import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Feedback() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/feedback",
        { complaint: complaintId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Feedback submitted successfully!");
      setTimeout(() => navigate("/my-complaints"), 1000);
    } catch (error) {
      setMessage("Failed to submit feedback");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
      <h2>Give Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Rating (1 to 5)</label><br />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="1">1 - Very Poor</option>
            <option value="2">2 - Poor</option>
            <option value="3">3 - Average</option>
            <option value="4">4 - Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Comment (optional)</label><br />
          <textarea
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#2c5f8a", color: "white", border: "none" }}>
          Submit Feedback
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Feedback;