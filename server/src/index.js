import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Import database connection
import { connectDB } from "./config/database.js";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import diagnosisRoutes from "./routes/diagnosis.js";
import reportsRoutes from "./routes/reports.js";
import insightsRoutes from "./routes/insights.js";
import qaRoutes from "./routes/qa.js";
import documentsRoutes from "./routes/documents.js";
import dashboardRoutes from "./routes/dashboard.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("🚀 Database connection established");
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    // Continue running the server even if database connection fails
  });

// Security middleware (allow OAuth popups to close)
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: "*",
    // origin: [
    //   process.env.CLIENT_URL || 'http://localhost:5173',
    //   'http://localhost:8080'
    // ],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
app.use(morgan("combined"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "DermX-AI Server is running",
    timestamp: new Date().toISOString(),
    database: "Connected", // You can enhance this to check actual DB status
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/diagnosis", diagnosisRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/qa", qaRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Serve uploaded images
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=31536000");
  next();
});
app.use(
  "/uploads",
  (await import("express")).default.static(
    path.join(__dirname, "../public/uploads")
  )
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  });
});

export default app;
