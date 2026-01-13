module.exports = {
  name: "poll",
  requiredRole: "Member", // anyone can use
  async execute(message, args) {
    if (!args.length) {
      return message.reply("Usage: `/poll <question>`");
    }

    const question = args.join(" ");

    // Send the poll message
    const pollMessage = await message.channel.send(`📊 **Poll:** ${question}`);
    
    // Add reactions for voting
    await pollMessage.react("✅"); // Yes
    await pollMessage.react("❌"); // No
  }
};
