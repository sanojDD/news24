import { Link, useLocation, useNavigate } from "react-router-dom";
import "./NavBar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to login after logout
    window.location.reload(); // Refresh to clear state
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo-text">
          Tuk<span>Tuk</span>
        </Link>
      </div>

      <div className="nav-links">
        <Link
          to="/"
          className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link
          to="/reels"
          className={`nav-item ${location.pathname === "/reels" ? "active" : ""}`}
        >
          Reels
        </Link>
        <Link
          to="/about"
          className={`nav-item ${location.pathname === "/about" ? "active" : ""}`}
        >
          About
        </Link>
      </div>

      <div className="navbar-actions">
        {user ? (
          <div className="user-controls">
            <span className="user-status">{user.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
