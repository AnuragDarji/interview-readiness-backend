if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// DB connection
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  }),
);

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/skills", require("./routes/skill.routes"));
app.use("/api/questions", require("./routes/question.routes"));
app.use("/api/test", require("./routes/test.routes"));
app.use("/api/assessments", require("./routes/assessment.routes"));
app.use("/api/readiness", require("./routes/readiness.routes"));

module.exports = app;
