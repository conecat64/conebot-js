const { REST, Routes } = require('discord.js');
const { guildId, clientId } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandsFolder = fs.readdirSync(commandsPath);

for (const commandModule of commandsFolder) {
    const pathToModule = path.join(commandsPath, commandModule);
    const command = require(pathToModule);

    commands.push(command.data.toJSON());
}