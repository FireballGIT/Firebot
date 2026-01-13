/**
 * Calculate level from XP
 * @param {number} xp - total XP
 * @returns {number} level
 */
function getLevelFromXp(xp) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Calculate XP needed for next level
 * @param {number} level - current level
 * @returns {number} XP required for next level
 */
function getXpForNextLevel(level) {
  return Math.pow(level, 2) * 100;
}

/**
 * Calculate XP difference to next level
 * @param {number} xp - current XP
 * @returns {number} XP remaining to next level
 */
function getXpToNextLevel(xp) {
  const level = getLevelFromXp(xp);
  return getXpForNextLevel(level) - xp;
}

module.exports = {
  getLevelFromXp,
  getXpForNextLevel,
  getXpToNextLevel
};
