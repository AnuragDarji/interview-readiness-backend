// Load environment variables (only for local development)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");

const app = express();

/* ================= MIDDLEWARE ================= */

// ✅ CORS should come first
app.use(
  cors({
    origin: process.env.CLIENT_URL, // frontend URL, no trailing slash
    credentials: true, // allow cookies if needed
  }),
);

// ✅ JSON parsing
app.use(express.json());

/* ================= DB CONNECTION ================= */
// Connect once on server start
connectDB()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1); // stop server if DB fails
  });

/* ================= ROOT ROUTE ================= */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Interview Readiness Backend is running 🚀",
    status: "OK",
  });
});

/* ================= API ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/skills", require("./routes/skill.routes"));
app.use("/api/questions", require("./routes/question.routes"));
app.use("/api/test", require("./routes/test.routes"));
app.use("/api/assessments", require("./routes/assessment.routes"));
app.use("/api/readiness", require("./routes/readiness.routes"));

/* ================= ERROR HANDLING ================= */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ================= EXPORT APP ================= */
// ❌ No app.listen() on serverless (Vercel)
module.exports = app;
