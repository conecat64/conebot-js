const { channelId } = require('../config.json');

module.exports = {
    name: 'interactionCreate',
    onEvent: async (interaction) => {
        await interaction.reply('Hello bro');
    }
}