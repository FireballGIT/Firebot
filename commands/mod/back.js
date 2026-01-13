module.exports = {
  name: "back",
  requiredRole: "Mod", // Mods+ and Admins+
  async execute(message, args) {
    const memberRoles = message.member.roles.cache.map(r => r.name);
    if (!memberRoles.includes("Mod") && !memberRoles.includes("Admin")) {
      return message.reply("🚫 You do not have permission to use this command.");
    }

    if (args.length < 2) {
      return message.reply("Usage: `!back <user> <message>`");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("Please mention a user.");

    const content = args.slice(1).join(" ");

    // Find the message in the last 100 messages from this user that matches the content
    const fetched = await message.channel.messages.fetch({ limit: 100 });
    const target = fetched.find(m => m.author.id === user.id && m.content === content);

    if (!target) return message.reply("Message not found.");

    await target.delete().catch(err => {
      return message.reply(`Failed to delete message: ${err}`);
    });

    message.channel.send(`🗑️ Deleted message from ${user.user.tag}: "${content}"`);
  }
};
