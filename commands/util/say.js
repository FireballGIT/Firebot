module.exports = {
  name: "say",
  requiredRole: "Member", // anyone can use
  execute(message, args) {
    if (!args.length) {
      return message.reply("Usage: `/say <message>`");
    }

    const content = args.join(" ");

    message.channel.send(content);
  }
};
