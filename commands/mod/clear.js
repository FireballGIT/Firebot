const fs = require("fs");
const path = require("path");

const usersDB = path.join(__dirname, "../../database/users.json");

function loadUsers() {
  if (!fs.existsSync(usersDB)) fs.writeFileSync(usersDB, "{}");
  return JSON.parse(fs.readFileSync(usersDB, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(usersDB, JSON.stringify(users, null, 2));
}

module.exports = {
  name: "clear",
  requiredRole: "Mod", // Mods+ and Admins+
  execute(message, args) {
    const memberRoles = message.member.roles.cache.map(r => r.name);
    if (!memberRoles.includes("Mod") && !memberRoles.includes("Admin")) {
      return message.reply("🚫 You do not have permission to use this command.");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("Please mention a user to clear warnings from.");

    const users = loadUsers();
    if (!users[user.id] || !users[user.id].warnings.length) {
      return message.reply("This user has no warnings to clear.");
    }

    users[user.id].warnings = [];
    saveUsers(users);

    message.channel.send(`✅ All warnings cleared for ${user.user.tag}.`);
  }
};
