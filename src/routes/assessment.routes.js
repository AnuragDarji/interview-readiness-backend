const express = require("express");
const Assessment = require("../models/Assessment.model");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/* ===== SUBMIT ASSESSMENT ===== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { topic, score, total, type } = req.body;

    const assessment = await Assessment.create({
      userId: req.user.id,
      topic,
      score,
      total,
      type,
    });

    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===== GET USER ASSESSMENTS ===== */
router.get("/", authMiddleware, async (req, res) => {
  const assessments = await Assessment.find({
    userId: req.user.id,
  }).sort({ createdAt: -1 });

  res.json(assessments);
});

module.exports = router;
