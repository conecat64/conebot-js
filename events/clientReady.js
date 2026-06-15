const { channelId } = require('../config.json');

const fs = require('node:fs');
const path = require('node:path');

const commandsArray = [];
const commandsFolder = fs.readdirSync('./commands');

for (const commandModule of commandsFolder) {
    console.log(commandModule);
    const pathToModule = '../commands/' + commandModule
    const command = require(pathToModule);

    commandsArray.push(command.data);
}

module.exports = {
    name: 'clientReady',
    onEvent: async (client) => {
        let channel = await client.channels.fetch(channelId);

        client.application.commands.set(commandsArray);

        console.log('Started');
        //channel.send('HELO WORLD!');
    }
}