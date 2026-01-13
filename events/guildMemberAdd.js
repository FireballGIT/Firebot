const config = require("../config/config.json")

module.exports = {
    name: "guildMemberAdd",
    once: false,
    async execute(member) {
        if (!config.features.welcomeMessages) return;

        const channel = member.guild.channels.cache.find(
            c => c.name === config.channels.welcome
        );

        if (!channel) return;

        const WelcomeMessage = config.welcome.message.replace("{user}", `<@${member.id}>`)

        channel.send(welcomeMessage);
    }
};