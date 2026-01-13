module.exports = {
  name: "slowmode",
  requiredRole: "Mod", // Mods+ and Admins+
  async execute(message, args) {
    const memberRoles = message.member.roles.cache.map(r => r.name);
    if (!memberRoles.includes("Mod") && !memberRoles.includes("Admin")) {
      return message.reply("🚫 You do not have permission to use this command.");
    }

    const channel = message.mentions.channels.first() || message.channel;
    const time = parseInt(args[1], 10);
    if (isNaN(time)) return message.reply("Time must be a number (in seconds).");

    await channel.setRateLimitPerUser(time).catch(err => message.reply(`Failed: ${err}`));
    message.channel.send(`⏱️ Slowmode set to ${time} seconds for ${channel.name}`);
  }
};
