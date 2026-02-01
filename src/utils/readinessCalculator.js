const clamp = (num, min = 0, max = 1) =>
  Math.min(max, Math.max(min, num));

const calculateReadiness = ({ skills, assessments }) => {
  let skillScore = 0;
  let assessmentScore = 0;

  /* ---------- SKILL SCORE ---------- */
  if (skills.length > 0) {
    const totalConfidence = skills.reduce(
      (sum, s) => sum + Number(s.confidenceLevel || 0),
      0
    );

    const maxConfidence = skills.length * 5;
    skillScore = totalConfidence / maxConfidence;

    skillScore = clamp(skillScore); // 🔐 FIX
  }

  /* ---------- ASSESSMENT SCORE ---------- */
  if (assessments.length > 0) {
    const totalObtained = assessments.reduce(
      (sum, a) => sum + Number(a.score || 0),
      0
    );

    const totalPossible = assessments.reduce(
      (sum, a) => sum + Number(a.total || 0),
      0
    );

    if (totalPossible > 0) {
      assessmentScore = totalObtained / totalPossible;
      assessmentScore = clamp(assessmentScore); // 🔐 FIX
    }
  }

  /* ---------- FINAL SCORE ---------- */
  const readiness =
    skillScore * 0.4 +
    assessmentScore * 0.6;

  return Math.round(clamp(readiness) * 100); // 🔒 FINAL LOCK
};

module.exports = calculateReadiness;
