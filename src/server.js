// Load env only for local development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");

const app = express();

/* ================= DB CONNECTION ================= */
// IMPORTANT: do NOT connect on import in serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

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

/* ================= EXPORT APP ================= */
// ❌ NO app.listen() on Vercel
module.exports = app;
