const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('verify').setDescription('verifies you'),
    async execute(interaction) {
        await interaction.reply({ content: 'I didn\'t verify you, because im doing jack shit right now aside from sending a message. fuck you.', flags: MessageFlags.Ephemeral });
    }
}