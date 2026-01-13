const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "embed",
  requiredRole: "Member", // can adjust later
  execute(message, args) {
    if (!args.length) {
      return message.reply("Usage: `/embed <message>`");
    }

    const content = args.join(" ");

    const embed = {
      color: 0xff5500, // orange firebot color
      description: content,
      timestamp: new Date(),
      footer: {
        text: `Sent by ${message.author.tag}`
      }
    };

    message.channel.send({ embeds: [embed] });
  }
};
