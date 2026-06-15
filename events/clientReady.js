const { Collection } = require('discord.js');
const { channelId } = require('../config.json');

const fs = require('node:fs');
const path = require('node:path');

const commandsArray = [];
const commandsFolder = fs.readdirSync('./commands');

module.exports = {
    name: 'clientReady',
    
    onEvent: async (client) => {
        let channel = await client.channels.fetch(channelId);

        client.commands = {};

        for (const commandModule of commandsFolder) {
            const pathToModule = '../commands/' + commandModule
            const command = require(pathToModule);

            client.commands[command.data.name] = command;

            commandsArray.push(command.data);
        }

        client.application.commands.set(commandsArray);
    }
}