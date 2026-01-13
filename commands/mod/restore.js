const activeWipes = require("../../utils/wipeState");

module.exports = {
  name: "restore",
  requiredRole: "Admin", // Only rank that started the wipe can cancel
  execute(message) {
    const wipe = activeWipes.cancel(message.author.id);
    if (!wipe) return message.reply("🚫 You have no active wipe to restore.");
    message.channel.send("✅ Wipe has been canceled.");
  }
};
