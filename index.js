const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const fs = require('fs');

require('dotenv').config();

fs.readdirSync('events').forEach((eventName) => {
    let module = require('./events/' + eventName);
    client.on(module.name, module.onEvent);
})

client.login(process.env.TOKEN);