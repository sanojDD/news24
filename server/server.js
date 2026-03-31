import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// 1. Import Routes
import reelRoutes from "./routes/reelRoutes.js";
import contactRoutes from "./routes/contact.js";
import authRoutes from "./routes/authRoutes.js";

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 2. ADVANCED CORS CONFIGURATION ---
// This allows your local dev environment AND your future live site to talk to the API
const allowedOrigins = [
  "http://localhost:5173", // Local Vite Frontend
  "https://your-tuktuk-frontend.vercel.app", // Placeholder for your future live URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, mobile apps, or server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy blocked this request"), false);
      }
    },
    credentials: true,
  }),
);

// --- 3. MIDDLEWARE ---
app.use(express.json()); // Parses incoming JSON requests

// --- 4. ROUTES MIDDLEWARE ---
app.use("/api/auth", authRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/contact", contactRoutes);

// --- 5. HEALTH CHECK ROUTE ---
// Important for Deployment: Hosting services 'ping' this to see if the app is alive
app.get("/", (req, res) => {
  res.status(200).send("🚀 TukTuk API is Running Successfully!");
});

// --- 6. DATABASE & SERVER START ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected: " + mongoose.connection.host);

    // Start server only AFTER successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server is active on port ${PORT}`);
      console.log(`📡 Local: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    // Exit the process if the database connection fails
    process.exit(1);
  });
