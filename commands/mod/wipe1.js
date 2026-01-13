const activeWipes = require("../../utils/wipeState");

module.exports = {
  name: "wipe1",
  requiredRole: "Admin",
  execute(message) {
    if (!message.member.roles.cache.some(r => r.name === "Admin")) return message.reply("🚫 You cannot use this.");
    const channel = message.channel;
    activeWipes.start(message.author.id, 1, channel);
    message.channel.send("⚠️ Wipe 1 activated! 30 seconds to cancel with !restore");
  }
};
