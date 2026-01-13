module.exports = {
  name: "purge",
  requiredRole: "Mod", // Mods+ and Admins+
  async execute(message, args) {
    const memberRoles = message.member.roles.cache.map(r => r.name);
    if (!memberRoles.includes("Mod") && !memberRoles.includes("Admin")) {
      return message.reply("🚫 You do not have permission to use this command.");
    }

    const channel = message.mentions.channels.first() || message.channel;
    const amount = parseInt(args[1], 10);
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply("Amount must be a number between 1 and 100.");
    }

    const fetched = await channel.messages.fetch({ limit: amount });
    await channel.bulkDelete(fetched, true).catch(err => message.reply(`Failed: ${err}`));
    message.channel.send(`🗑️ Purged ${fetched.size} messages in ${channel.name}`);
  }
};
