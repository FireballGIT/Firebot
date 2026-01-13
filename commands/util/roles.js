module.exports = {
  name: "roles",
  requiredRole: "Member", // Can adjust if you want higher later
  execute(message) {
    const roles = message.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map(r => r.name)
      .join(", ");

    message.channel.send(`**Server Roles:**\n${roles}`);
  }
};
