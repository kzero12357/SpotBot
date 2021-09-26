const {Client , Collection} = require("discord.js")
const client = new Client({
    disableEveryone: true,
    disabledEvents: ["TYPING_START"]
});
const config = require("./config.js")
client.commands = new Collection();
client.aliases = new Collection();
client.limits = new Map();
client.snipe = new Set()
client.config = config;
const command = require("./structures/command");
command.run(client);

const events = require("./structures/event");
events.run(client)

client.login(config.token)