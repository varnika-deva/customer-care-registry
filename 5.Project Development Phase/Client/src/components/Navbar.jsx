import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      backgroundColor: "#2c5f8a",
      color: "white"
    }}>
      <h3 style={{ margin: 0 }}>Care</h3>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>

        {!user && (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
            <Link to="/register" style={{ color: "white", textDecoration: "none" }}>Register</Link>
          </>
        )}

        {user && user.role === "customer" && (
          <>
            <Link to="/raise-complaint" style={{ color: "white", textDecoration: "none" }}>Complaints</Link>
            <Link to="/my-complaints" style={{ color: "white", textDecoration: "none" }}>My Complaints</Link>
          </>
        )}

        {user && user.role === "agent" && (
          <Link to="/agent-dashboard" style={{ color: "white", textDecoration: "none" }}>Agent Dashboard</Link>
        )}

        {user && user.role === "admin" && (
          <Link to="/admin-dashboard" style={{ color: "white", textDecoration: "none" }}>Admin Dashboard</Link>
        )}

        {user && (
          <button
            onClick={handleLogout}
            style={{ padding: "6px 14px", backgroundColor: "white", color: "#2c5f8a", border: "none", cursor: "pointer", borderRadius: "4px" }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;