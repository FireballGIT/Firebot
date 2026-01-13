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
  name: "warn",
  requiredRole: "Mod", // Mods+ and Admins+ can use
  execute(message, args) {
    const memberRoles = message.member.roles.cache.map(r => r.name);
    if (!memberRoles.includes("Mod") && !memberRoles.includes("Admin")) {
      return message.reply("🚫 You do not have permission to use this command.");
    }

    if (args.length < 2) {
      return message.reply("Usage: `!warn <user> <reason>`");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("Please mention a user to warn.");

    const reason = args.slice(1).join(" ");

    const users = loadUsers();
    if (!users[user.id]) users[user.id] = { xp: 0, level: 1, warnings: [] };
    users[user.id].warnings.push({
      reason,
      date: new Date(),
      moderator: message.author.id,
      id: users[user.id].warnings.length + 1
    });

    saveUsers(users);

    message.channel.send(`⚠️ ${user.user.tag} has been warned for: ${reason}`);
  }
};
