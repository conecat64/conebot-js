const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');
const { places, embedColors, modRoles } = require('../config.json');

const runSandboxedLuau = require('../utils/runSandboxedLuau');
const getUserHeadshot = require('../utils/getUserHeadshot');
const getUserInfo = require('../utils/getUserInfo');
const getGameIcon = require('../utils/getGameIcon');
const errorEmbed = require('../utils/errorEmbed');

module.exports = {
    moderatorOnly: true,
    
    data: new SlashCommandBuilder()
        .setName('toggle-ban')
        .setDescription('Toggle someone\'s banned status from a CONECORP game.')
        .addBooleanOption(option => option.setName('banned').setDescription('Whether or not the player should be banned or not.').setRequired(true))
        .addStringOption(option => option.setName('username').setDescription('Username of the targeted player.').setRequired(true))
        .addStringOption(option => option.setName('game').setDescription('Choose a game.').setRequired(true).setChoices(
            { name: 'SUPER BLOX 64!', value: 'sb64' },
            { name: 'Superstar Racers', value: 'sr' },
            { name: 'A Block\'s Journey', value: 'abj' }
        )
    ),

    async execute(interaction) {
        let client = interaction.client;
        let member = interaction.member;

        let banned = interaction.options.getBoolean('banned');
        let username = interaction.options.getString('username');
        let gameName = interaction.options.getString('game');

        let placeInfo = places[gameName];
        let userInfo = await getUserInfo(client, username);

        if (!userInfo) {
            await errorEmbed(interaction, 'Failed to fetch data for ' + username + '.')
            return;
        }

        let gameIcon = await getGameIcon(client, gameName);
        let userHeadshot = await getUserHeadshot(client, userInfo.id);

        let userInfoString = '**' + userInfo.displayName + '** (@' + userInfo.name + ') from **' + placeInfo.name + '**.'
        let embed = new EmbedBuilder()
            .setTitle('Toggle ban status')
            .setAuthor({ name: userInfo.displayName, iconURL: userHeadshot })
            .setFooter({ text: 'conebot by CONECORP', iconURL: gameIcon })
            .setTimestamp()

        if (banned) {
            embed.setDescription('Successfully banned ' + userInfoString).setColor(embedColors.red)
            scriptContent = 'game.Players:BanAsync({ UserIds = { <ID> }, Duration = -1, DisplayReason = \'Banned by admin\', PrivateReason = \'Banned by admin\' })'

        } else {
            embed.setDescription('Successfully unbanned ' + userInfoString).setColor(embedColors.green)
            scriptContent = 'game.Players:UnbanAsync({ UserIds = { <ID> }, ApplyToUniverse = true })'
        }

        scriptContent = scriptContent.replace('<ID>', userInfo.id);
        runSandboxedLuau(client, gameName, scriptContent);

        await interaction.reply({ embeds: [embed] });
    }
}