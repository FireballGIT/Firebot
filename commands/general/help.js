const fs = require("fs");
const path = require("path");
const { getPermissionLevel } = require("../../utils/permissionCheck");
const permissions = require("../../config/permissions.json");

module.exports = {
  name: "help",
  requiredRole: "Member",
  execute(message) {
    const prefix = "?";
    const memberLevel = getPermissionLevel(message.member);

    const commandsDir = path.join(__dirname);
    const files = fs.readdirSync(commandsDir).filter(f => f.endsWith(".js"));

    let reply = "**Firebot Commands:**\n";

    files.forEach(file => {
      const cmd = require(path.join(commandsDir, file));
      const cmdLevel = permissions[cmd.requiredRole] ?? 0;
      const color = memberLevel >= cmdLevel ? "🟢" : "🔴";
      reply += `${color} \`${prefix}${cmd.name}\`\n`;
    });

    message.channel.send(reply);
  }
};

