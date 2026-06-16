const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');
const { places, embedColors, emojis } = require('../config.json');

const formatTime = require('../utils/formatTime')

const START_BOLD = '\n\u{001b}[1;2m'
const END_BOLD = '\u{001b}[0m'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-stats')
        .setDescription('View the bot\'s stats'),

    async execute(interaction) {
        let client = interaction.client;
        let user = interaction.member.user;
        let curTimeSeconds = Date.now() / 1000;
        let secondsDiff = (curTimeSeconds - client.startTime).toString();
        let ping = (Date.now() - interaction.createdTimestamp).toString();

        let embed = new EmbedBuilder()
            .setTitle('Bot stats')
            .setColor(embedColors.orange)
            .setTimestamp()
            .setFooter({ text: 'conebot by CONECORP', iconURL: user.displayAvatarURL() })
            .addFields(
                { name: emojis.sparkles + 'Uptime', value: formatTime(secondsDiff), inline: true },
                { name: emojis.question + 'Ping', value: ping + 'ms', inline: true }
            )

        await interaction.reply({ embeds: [embed] });
    }
}