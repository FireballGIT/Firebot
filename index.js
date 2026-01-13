const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config/config.json");
const logger = require("./utils/logger");

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Command collections
client.commands = {
  general: new Collection(), // ?
  mod: new Collection(),     // !
  util: new Collection()     // /
};

// Attach config
client.config = config;

// ===== LOAD COMMANDS =====
const commandFolders = [
  { name: "general", prefix: config.prefixes.general },
  { name: "mod", prefix: config.prefixes.mod },
  { name: "util", prefix: config.prefixes.util }
];

for (const folder of commandFolders) {
  const folderPath = path.join(__dirname, "commands", folder.name);
  if (!fs.existsSync(folderPath)) continue;

  const commandFiles = fs
    .readdirSync(folderPath)
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);

    if (!command.name || typeof command.execute !== "function") {
      logger.warn(`Invalid command file: ${file}`);
      continue;
    }

    client.commands[folder.name].set(command.name, command);
    logger.info(`Loaded ${folder.prefix}${command.name}`);
  }
}

// ===== LOAD EVENTS =====
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }

  logger.info(`Event loaded: ${event.name}`);
}

// ===== READY =====
client.once("ready", () => {
  logger.success(`🔥 Logged in as ${client.user.tag}`);
});

// ===== LOGIN =====
client.login("MTQ1MjM4MTYyMjYzMTQwMzczNA.GSz_R8.zh__RcopDA1Cs1viHdV0pN-DcjEAXxYLg5nGA0");
