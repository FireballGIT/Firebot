module.exports = {
  name: "ban",
  requiredRole: "Mod", // Mods+ and Admins+
  async execute(message, args) {
    const memberRoles = message.member.roles.cache.map(r => r.name);
    if (!memberRoles.includes("Mod") && !memberRoles.includes("Admin")) {
      return message.reply("🚫 You do not have permission to use this command.");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("Please mention a user to ban.");

    if (!args[1]) return message.reply("Please specify a ban duration in days or type `perm` for permanent.");

    let reason = args.slice(2).join(" ") || "No reason provided";

    if (args[1].toLowerCase() === "perm") {
      await user.ban({ reason }).catch(err => {
        return message.reply(`Failed to ban user: ${err}`);
      });
      return message.channel.send(`⛔ ${user.user.tag} has been permanently banned. Reason: ${reason}`);
    }

    const days = parseInt(args[1], 10);
    if (isNaN(days) || days < 1) return message.reply("Invalid ban duration. Must be a number of days or `perm`.");

    await user.ban({ days, reason }).catch(err => {
      return message.reply(`Failed to ban user: ${err}`);
    });

    message.channel.send(`⛔ ${user.user.tag} has been banned for ${days} day(s). Reason: ${reason}`);
  }
};
