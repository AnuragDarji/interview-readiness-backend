const express = require("express");
const Question = require("../models/Question.model");

const router = express.Router();

/* ===== ADD QUESTION ===== */
router.post("/", async (req, res) => {
  try {
    const { skill, question, options, correctAnswer, difficulty } = req.body;

    const q = await Question.create({
      skill,
      question,
      options,
      correctAnswer,
      difficulty,
    });

    res.status(201).json(q);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
