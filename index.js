// ======================
// Firebot Main File
// ======================

// Load environment variables
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

// Logger
const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  success: (msg) => console.log(`[SUCCESS] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`)
};

console.log("RAW TOKEN: ", process.env.BOT_TOKEN);

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message]
});

// Collections for commands
client.commands = new Collection();
client.utilCommands = new Collection();

// Load commands dynamically
const commandFolders = ['general', 'mod', 'util'];
for (const folder of commandFolders) {
  const folderPath = path.join(__dirname, 'commands', folder);
  if (!fs.existsSync(folderPath)) continue;

  const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(folderPath, file));
    if (folder === 'util') {
      client.utilCommands.set(command.name, command);
    } else {
      client.commands.set(command.name, command);
    }
    logger.info(`Loaded command ${command.name} from ${folder}`);
  }
}

// Load events dynamically
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  const eventName = file.split('.')[0];

  if (event.once) {
    client.once(eventName, (...args) => event.execute(client, ...args));
  } else {
    client.on(eventName, (...args) => event.execute(client, ...args));
  }
  logger.info(`Loaded event ${eventName}`);
}

// Simple XP system (basic)
client.xp = new Map();

client.on('messageCreate', message => {
  if (message.author.bot) return;

  const now = Date.now();
  const cooldown = 60 * 1000; // 60s
  const userId = message.author.id;

  if (!client.xp.has(userId)) {
    client.xp.set(userId, { xp: 0, lastMessage: 0, level: 0 });
  }

  const userData = client.xp.get(userId);
  if (now - userData.lastMessage >= cooldown) {
    userData.xp += 5;
    userData.lastMessage = now;

    // Level up example: level threshold = 100 XP
    const levelThreshold = (userData.level + 1) * 100;
    if (userData.xp >= levelThreshold) {
      userData.level += 1;
      const levelUpChannelId = require('./config/config.json').channels.leveling;
      const channel = message.guild.channels.cache.get(levelUpChannelId);
      if (channel) {
        channel.send(`OH MY GOD!!! <@${userId}>!!! YOU JUST REACHED LEVEL ${userData.level}!!!`);
      }
    }
    client.xp.set(userId, userData);
  }
});

// Welcome new members
client.on('guildMemberAdd', member => {
  const welcomeConfig = require('./config/config.json').welcome;
  if (!welcomeConfig.enabled) return;

  const channel = member.guild.channels.cache.get(welcomeConfig.channel);
  if (!channel) return;

  const msg = welcomeConfig.message.replace('{user}', `<@${member.id}>`);
  channel.send(msg);
});

// Login
client.login(process.env.DISCORD_TOKEN)
  .then(() => logger.success(`Logged in as ${client.user.tag}`))
  .catch(err => logger.error(`Login failed: ${err}`));
