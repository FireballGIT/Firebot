const activeWipes = require("../../utils/wipeState");

module.exports = {
  name: "wipe2",
  requiredRole: "Mod",
  execute(message) {
    if (!message.member.roles.cache.some(r => r.name === "Mod")) return message.reply("🚫 You cannot use this.");
    const channel = message.channel;
    activeWipes.start(message.author.id, 2, channel);
    message.channel.send("⚠️ Wipe 2 activated! 30 seconds to cancel with !restore");
  }
};
