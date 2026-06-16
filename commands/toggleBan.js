const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');
const { places, embedColors } = require('../config.json');

const runSandboxedLuau = require('../utils/runSandboxedLuau');
const getUserHeadshot = require('../utils/getUserHeadshot');
const getUserInfo = require('../utils/getUserInfo');
const getGameIcon = require('../utils/getGameIcon');
const errorEmbed = require('../utils/errorEmbed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggle-ban')
        .setDescription('Toggle someone\'s banned status from a CONECORP game.')

        .addBooleanOption(option => option
            .setName('banned')
            .setDescription('Whether or not the player should be banned or not.')
            .setRequired(true)
        )

        .addStringOption(option => option
            .setName('username')
            .setDescription('Username of the targeted player.')
            .setRequired(true)
        )

        .addStringOption(option => option
            .setName('game')
            .setDescription('Choose a game.')
            .setRequired(true)
            .setChoices(
                { name: 'SUPER BLOX 64!', value: 'sb64' },
                { name: 'Superstar Racers', value: 'sr' },
                { name: 'A Block\'s Journey', value: 'abj' }
            )
        ),

    async execute(interaction) {
        let client = interaction.client;
        let member = interaction.member;

        let roles = await member.roles.fetch();
        let hasRole = roles.find(r => r.name === 'Manager');

        console.log(hasRole);

        let banned = interaction.options.getBoolean('banned');
        let username = interaction.options.getString('username');
        let gameName = interaction.options.getString('game');

        let placeInfo = places[gameName];
        let userData = await getUserInfo(client, username);

        if (!userData) {
            await errorEmbed(interaction, 'Failed to fetch data for ' + username + '.')
            return;
        }

        let gameIcon = await getGameIcon(client, gameName);
        let userHeadshot = await getUserHeadshot(client, userData.id);

        let userInfoString = '**' + userData.displayName + '** (@' + userData.name + ') from **' + placeInfo.name + '**.'
        let embed = new EmbedBuilder()
            .setTimestamp()

        if (banned) {
            embed.setAuthor({ name: 'User banned', iconURL: userHeadshot })
                .setDescription('Successfully banned ' + userInfoString)
                .setFooter({ text: 'Goodbye!', iconURL: gameIcon })
                .setColor(embedColors.red)

            scriptContent = `
            local config = { UserIds = { <ID> }, Duration = -1, DisplayReason = 'Banned by admin', PrivateReason = 'Banned by admin' }
            game.Players:BanAsync(config)`

        } else {
            embed.setAuthor({ name: 'User unbanned', iconURL: userHeadshot })
                .setDescription('Successfully unbanned ' + userInfoString)
                .setFooter({ text: 'Welcome back!', iconURL: gameIcon })
                .setColor(embedColors.green)

            scriptContent = `
            local config = { UserIds = { <ID> }, ApplyToUniverse = true }
            game.Players:UnbanAsync(config)`
        }

        scriptContent = scriptContent.replace('<ID>', userData.id);
        runSandboxedLuau(client, gameName, scriptContent);

        await interaction.reply({ embeds: [embed] });
    }
}