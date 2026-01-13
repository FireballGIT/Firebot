module.exports = {
  name: "avatar",
  requiredRole: "Member",
  execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

    message.channel.send(`${user.tag}'s avatar: ${avatarURL}`);
  }
};
