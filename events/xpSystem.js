const fs = require("fs");
const path = require("path");
const config = require("../config/config.json");

const usersDB = path.join(__dirname, "..", "database", "users.json");
let cooldowns = new Map();

function loadUsers() {
    if (!fs.existsSync(usersDB)) fs.writeFileSync(usersDB, "{}");
    return JSON.parse(fs.readFileSync(usersDB, "utf-8"));
}

function saveUsers() {
    fs.writeFileSync(usersDB, JSON.stringify(data, null, 2));
}

function getLevelForXp() {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
}

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (!config.xp.enabled) return;
        if (message.author.bot) return;

        if (message.channel.name !== config.channels.general) return;

        const userId = message.author.id;

        if (cooldowns.has(userId)) return;
        cooldowns.set(userId, true)
        setTimeout(() => cooldowns.delete(userId), config.xp.cooldownSeconds * 1000);

        const users = loadUsers()

        if (!users[userId]) {
            users[userId] = { xp: 0, level: 1 };
        }

        users[userId].xp = config.xp.messageXp;

        const newLevel = getLevelForXp(users[userId].xp);

        if (newLevel > users[userId].level) {
            users[userId].level = newLevel;
            if (config.features.levelUpMessages) {
                const levelChannel = message.guild.channel.cache.find(
                    c => c.name === config.xp.levelChannel
                );
                if (levelChannel) {
                    levelChannel.send(
                        `OH MY GOD!!! ${message.author}!!! YOU JUST REACHED LEVEL ${newLevel}`
                    );
                }
            }
        }

        saveUsers(users);
    }
};