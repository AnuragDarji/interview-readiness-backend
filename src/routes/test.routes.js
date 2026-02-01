const express = require("express");
const Skill = require("../models/Skill.model");
const Question = require("../models/Question.model");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/* ===== GENERATE TEST BASED ON SKILLS ===== */
router.get("/generate", authMiddleware, async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const userId = req.user.id;

    // 1️⃣ Get user skills
    const skills = await Skill.find({ userId });

    if (!skills.length) {
      return res.status(400).json({ message: "Please add skills first" });
    }

    // 2️⃣ Get weakest 2 skills (normalized to lowercase)
    const weakestSkills = skills
      .sort((a, b) => a.confidenceLevel - b.confidenceLevel)
      .slice(0, 2)
      .map((s) => s.skillName.toLowerCase());

    console.log("Searching for questions with skills:", weakestSkills); // Debug log

    // 3️⃣ Get questions - FIXED QUERY
    const questions = await Question.find({
      skill: { $in: weakestSkills }
    })  
    .limit(10);

    // 4️⃣ Shuffle for randomness if needed
    const shuffledQuestions = questions.sort(() => 0.5 - Math.random());

    // 5️⃣ Safety check
    if (!shuffledQuestions.length) {
      return res.status(404).json({
        message: "No questions found for selected skills",
        debug: {
          weakestSkills,
          totalQuestionsInDB: await Question.countDocuments(),
          matchingQuestions: await Question.countDocuments({ 
            skill: { $in: weakestSkills } 
          })
        }
      });
    }

    // 6️⃣ Send response
    res.json({
      skills: weakestSkills,
      totalQuestions: shuffledQuestions.length,
      questions: shuffledQuestions,
    });
  } catch (error) {
    console.error("Error generating test:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
