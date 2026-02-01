const express = require("express");
const Skill = require("../models/Skill.model");
const Assessment = require("../models/Assessment.model");
const authMiddleware = require("../middleware/auth.middleware");
const calculateReadiness = require("../utils/readinessCalculator");

const router = express.Router();

/* ===== GET READINESS SCORE ===== */
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  const skills = await Skill.find({ userId });
  const assessments = await Assessment.find({ userId });

  const readinessScore = calculateReadiness({
    skills,
    assessments,
  });

  res.json({
    readinessScore,
    totalSkills: skills.length,
    totalAssessments: assessments.length,
  });
});

module.exports = router;
