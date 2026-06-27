const errorEmbed = require('../utils/errorEmbed');
const { modRoles } = require('../config.json');

module.exports = {
    name: 'interactionCreate',

    onEvent: async (interaction) => {
        let client = interaction.client;

        try {
            if (client.commands[interaction.commandName].moderatorOnly) {
                let isModerator = false;

                for (index in modRoles) {
                    if (isModerator) break;
                    isModerator = interaction.member.roles.cache.some(role => role.id === modRoles[index]);
                }

                if (!isModerator) {
                    errorEmbed(interaction, 'You do not have sufficient permissions to run this command.');
                    return;
                }
            }

            await client.commands[interaction.commandName].execute(interaction);
        } catch (error) {
            errorEmbed(interaction, error, true);
        }
    }
}