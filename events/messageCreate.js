const fs = require("fs");
const path = require("path");

const config = require("../config/config.json");
const { hasPermission } = require("../utils/permissionCheck");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    const content = message.content;
    const channelName = message.channel.name;

    const prefixes = config.prefixes;
    let commandType = null;
    let prefixUsed = null;

    if (content.startsWith(prefixes.general)) {
      commandType = "general";
      prefixUsed = prefixes.general;
    } else if (content.startsWith(prefixes.mod)) {
      commandType = "mod";
      prefixUsed = prefixes.mod;
    } else if (content.startsWith(prefixes.util)) {
      commandType = "util";
      prefixUsed = prefixes.util;
    } else {
      return;
    }

    if (channelName !== config.channels.general) return;

    const args = content.slice(prefixUsed.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const commandFile = path.join(
      __dirname,
      "..",
      "commands",
      commandType,
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
    } catch (error) {
      console.error(error);
      message.reply("❌ An error occurred while running this command.");
    }
  }
};
