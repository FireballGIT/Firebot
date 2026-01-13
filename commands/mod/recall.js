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
  name: "recall",
  requiredRole: "Mod", // Mods+ and Admins+
  execute(message, args) {
    const memberRoles = message.member.roles.cache.map(r => r.name);
    if (!memberRoles.includes("Mod") && !memberRoles.includes("Admin")) {
      return message.reply("🚫 You do not have permission to use this command.");
    }

    if (args.length < 2) {
      return message.reply("Usage: `!recall <user> <warnid>`");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("Please mention a user to remove a warning from.");

    const warnId = parseInt(args[1], 10);
    if (isNaN(warnId)) return message.reply("Warning ID must be a number.");

    const users = loadUsers();
    if (!users[user.id] || !users[user.id].warnings.length) {
      return message.reply("This user has no warnings.");
    }

    const index = users[user.id].warnings.findIndex(w => w.id === warnId);
    if (index === -1) return message.reply("Warning ID not found.");

    const removed = users[user.id].warnings.splice(index, 1)[0];
    saveUsers(users);

    message.channel.send(`✅ Removed warning #${removed.id} from ${user.user.tag}.`);
  }
};
