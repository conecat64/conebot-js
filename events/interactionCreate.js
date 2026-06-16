module.exports = {
    name: 'interactionCreate',
    
    onEvent: async (interaction) => {
        let client = interaction.client;
        client.commands[interaction.commandName].execute(interaction);
    }
}