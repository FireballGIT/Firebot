const fs = require("fs");
const path = require("path");

const usersDB = path.join(__dirname, "../../database/users.json");

function loadUsers() {
  if (!fs.existsSync(usersDB)) fs.writeFileSync(usersDB, "{}");
  return JSON.parse(fs.readFileSync(usersDB, "utf8"));
}

module.exports = {
  name: "leaderboard",
  requiredRole: "Member",
  execute(message) {
    const users = loadUsers();

    // Sort users by XP descending
    const sorted = Object.entries(users)
      .sort(([, a], [, b]) => b.xp - a.xp)
      .slice(0, 10); // Top 10 users

    let reply = "**🔥 Firebot Leaderboard 🔥**\n";

    sorted.forEach(([id, data], i) => {
      const member = message.guild.members.cache.get(id);
      const name = member ? member.user.tag : "Unknown";
      reply += `**${i + 1}. ${name}** - Level ${data.level} (${data.xp} XP)\n`;
    });

    message.channel.send(reply);
  }
};
