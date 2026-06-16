const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { verifiedRoleId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder().setName('verify').setDescription('Gives you the verified role.'),

    async execute(interaction) {
        let member = interaction.member;
        let role = await interaction.guild.roles.fetch(verifiedRoleId);
        
        member.roles.add(role);

        await interaction.reply({
            content: 'Welcome to the server!',
            flags: MessageFlags.Ephemeral
        });
    }
}