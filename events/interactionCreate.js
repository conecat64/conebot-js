const errorEmbed = require('../utils/errorEmbed');

module.exports = {
    name: 'interactionCreate',

    onEvent: async (interaction) => {
        let client = interaction.client;

        try {
            await client.commands[interaction.commandName].execute(interaction);
        } catch (error) {
            errorEmbed(interaction, error, true);
        }
    }
}