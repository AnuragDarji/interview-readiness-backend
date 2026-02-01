const express = require("express");
const Skill = require("../models/Skill.model");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/* ===== ADD SKILL ===== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { skillName, confidenceLevel } = req.body;

    if (!skillName || !confidenceLevel) {
      return res.status(400).json({ message: "All fields required" });
    }

    const skill = await Skill.create({
      userId: req.user.id,
      skillName,
      confidenceLevel,
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===== GET USER SKILLS ===== */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user.id });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

/* ===== DELETE SKILL ===== */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const skillId = req.params.id;

    const skill = await Skill.findOne({
      _id: skillId,
      userId: req.user.id, // 🔥 ownership check
    });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await Skill.deleteOne({ _id: skillId });

    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

