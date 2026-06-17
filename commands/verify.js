const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');
const { verifiedRoleId, embedColors, emojis } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Gives you the Guest role.'),

    async execute(interaction) {
        let member = interaction.member;
        let user = member.user;
        let role = member.guild.roles.cache.find(role => role.id === verifiedRoleId);
        
        member.roles.add(role);

        let embed = new EmbedBuilder()
            .setTitle('Welcome to CONECORP!')
            .setFooter({ text: 'Welcome, ' + user.globalName + '!', iconURL: user.displayAvatarURL() })
            .setColor(embedColors.orange)
            .setTimestamp()
            .addFields(
                { name: emojis.book + 'Check the FAQ!', value: 'Also includes the rules, so be mindful!\n<#1187776384534327396>' },
                { name: emojis.colorboard + 'Get your color and ping roles!', value: '<#1286791191760867340>' },
                { name: emojis.eyes + 'Check out CONECORP\'s projects!', value: 'Stay up to date in <#1187868589273915393> and <#1186214086153863200>!' },
                { name: emojis.robux + 'Do you have A Block\'s Journey Early Access?', value: 'Redeem it by running `/redeem-early-access` in <#1474172093229830386>!\nIf not, you can buy it [here](https://www.roblox.com/game-pass/1507450319)!' }
            )

        //member.roles.add(role);

        await interaction.reply({ embeds: [embed] });
    }
}