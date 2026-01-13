const fs = require("fs");
const path = require("path");
const config = require("../config/config.json");
const { hasPermission } = require("../utils/permissionCheck");

module.exports = {
  name: "interactionCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    const content = message.content;
    const prefix = config.prefixes.util;

    if (!content.startsWith(prefix)) return;

    const args = content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const commandFile = path.join(
      __dirname,
      "..",
      "commands",
      "util",
      `${commandName}.js`
    );

    if (!fs.existsSync(commandFile)) return;

    const command = require(commandFile);

    if (command.requiredRole) {
      if (!hasPermission(message.member, command.requiredRole)) {
        return message.reply("🚫 You do not have permission to use this command.");
      }
    }

    try {
      await command.execute(message, args, client);
    } catch (err) {
      console.error(err);
      message.reply("❌ An error occurred while running this command.");
    }
  }
};
