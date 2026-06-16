const { Client } = require('discord.js');
const fs = require('fs');

const commandsArray = [];
const commandsFolder = fs.readdirSync('./commands');

module.exports = {
    name: 'clientReady',
    
    onEvent: async (client) => {
        client.commands = {};
        client.startTime = Date.now() / 1000;
        client.headers = {
                'x-api-key': process.env.API_KEY,
                'Content-Type': 'application/json'
            }

        for (const commandModule of commandsFolder) {
            const pathToModule = '../commands/' + commandModule;
            const command = require(pathToModule);

            client.commands[command.data.name] = command;
            commandsArray.push(command.data);
        }

        client.application.commands.set(commandsArray);
        console.log('Ready!');
    }
}