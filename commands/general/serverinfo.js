module.exports = {
  name: "serverinfo",
  requiredRole: "Member",
  execute(message) {
    const guild = message.guild;

    message.channel.send(
      `**Server Info**\n` +
      `Name: ${guild.name}\n` +
      `Members: ${guild.memberCount}\n` +
      `Owner: <@${guild.ownerId}>\n` +
      `ID: ${guild.id}`
    );
  }
};
