import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// 1. Import Global & Component CSS
import "./App.css";

// 2. Import Components
import Navbar from "./components/Navbar";
import ReelFeed from "./components/ReelFeed";
import AddReel from "./components/AddReel";
import ProtectedRoute from "./components/ProtectedRoute"; // Import your guard

// 3. Import Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";

// 4. Import Redux Actions
import { fetchReels } from "./features/reels/reelsSlice";

// --- SUB-COMPONENT FOR CONDITIONAL UI ---
const AppContent = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Get Redux state for reels
  const { status, error } = useSelector((state) => state.reels);

  // Simple check for Auth state to handle AddReel visibility
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchReels());
    }
  }, [status, dispatch]);

  // Loading State
  if (status === "loading") {
    return (
      <div className="loading-screen">
        <p>Loading TukTuk...</p>
      </div>
    );
  }

  // Error State
  if (status === "failed") {
    return <div className="error-screen">Error: {error}</div>;
  }

  return (
    <div className="app-layout">
      {/* Navbar stays visible on all pages */}
      <Navbar />

      <main className="main-content">
        <Routes>
          {/* PUBLIC ROUTES: Anyone can access these */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED ROUTES: Only logged-in users can access these */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reels"
            element={
              <ProtectedRoute>
                <div className="reels-page-wrapper">
                  <ReelFeed />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Logic: ONLY show AddReel if on "/reels" AND user is logged in */}
      {location.pathname === "/reels" && isAuthenticated && <AddReel />}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
