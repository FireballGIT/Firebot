module.exports = {
  name: "remind",
  requiredRole: "Member",
  async execute(message, args) {
    if (args.length < 3) {
      return message.reply("Usage: `/remind <user> <time in seconds> <message>`");
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply("Please mention a user to remind.");

    const time = parseInt(args[1], 10);
    if (isNaN(time) || time <= 0) return message.reply("Time must be a positive number (in seconds).");

    const reminder = args.slice(2).join(" ");

    message.channel.send(`⏰ Reminder set for ${user.tag} in ${time} seconds.`);

    setTimeout(() => {
      user.send(`🔔 Reminder from ${message.author.tag}: ${reminder}`).catch(() => {
        message.channel.send(`Could not DM ${user.tag}, but reminder was triggered.`);
      });
    }, time * 1000);
  }
};
