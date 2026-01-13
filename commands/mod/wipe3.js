const activeWipes = require("../../utils/wipeState");

module.exports = {
  name: "wipe3",
  requiredRole: "Owner",
  execute(message) {
    if (!message.member.roles.cache.some(r => r.name === "Owner")) return message.reply("🚫 You cannot use this.");
    activeWipes.start(message.author.id, 3, message.guild.channels.cache);
    message.channel.send("⚠️ Wipe 3 activated! 30 seconds to cancel with !restore");
  }
};
