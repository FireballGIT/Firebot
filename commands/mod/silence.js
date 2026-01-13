module.exports = {
  name: "silence",
  requiredRole: "Mod", // Mods+ and Admins+
  async execute(message, args) {
    const memberRoles = message.member.roles.cache.map(r => r.name);
    if (!memberRoles.includes("Mod") && !memberRoles.includes("Admin")) {
      return message.reply("🚫 You do not have permission to use this command.");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("Please mention a user to silence.");

    const amount = 100; // Number of messages to bulk delete (adjust as needed)
    const fetched = await message.channel.messages.fetch({ limit: amount });
    const userMessages = fetched.filter(m => m.author.id === user.id);

    if (!userMessages.size) return message.reply("No messages found for that user in this channel.");

    await message.channel.bulkDelete(userMessages, true).catch(err => {
      return message.reply(`Failed to delete messages: ${err}`);
    });

    message.channel.send(`🧹 All recent messages from ${user.user.tag} have been deleted.`);
  }
};
