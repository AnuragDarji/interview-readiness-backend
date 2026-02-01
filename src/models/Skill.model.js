const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skillName: {
    type: String,
    required: true,
  },
  confidenceLevel: {
    type: Number, // 1–5
    required: true,
  },
  lastPracticed: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Skill", skillSchema);
