const { Client, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

require('dotenv').config();

const fs = require('fs');

fs.readdirSync('events').forEach((eventName) => {
    let module = require('./events/' + eventName);
    client.on(module.name, module.onEvent);
})

client.on('interactionCreate', (slop) => {
    console.log(slop);
})

client.login(process.env.TOKEN);