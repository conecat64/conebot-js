const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('verify').setDescription('verifies you'),
    async execute(interaction) {
        await interaction.reply('poo');
    }
}