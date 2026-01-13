const fs = require("fs");
const path = require("path");
const usersDB = path.join(__dirname, "../../database/users.json");

function loadUsers() {
  if (!fs.existsSync(usersDB)) fs.writeFileSync(usersDB, "{}");
  return JSON.parse(fs.readFileSync(usersDB, "utf8"));
}

module.exports = {
  name: "userinfo",
  requiredRole: "Member",
  execute(message, args) {
    const user = message.mentions.members.first() || message.member;
    const users = loadUsers();
    const userData = users[user.id] || { xp: 0, level: 1 };

    message.channel.send(
      `**User Info for ${user.user.tag}**\n` +
      `Rank: ${user.roles.highest.name}\n` +
      `Level: ${userData.level}\n` +
      `XP: ${userData.xp}`
    );
  }
};
