const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');
const { places } = require('../../config.json');

const errorEmbed = require('../../utils/errorEmbed');
const getUserInfo = require('../../utils/getUserInfo');
const getUserHeadshot = require('./utils/getUserHeadshot')
const getSaveData = require('./utils/getSaveData')
const getGameIcon = require('./utils/getGameIcon')

const START_BOLD = '\n\u{001b}[1;2m'
const END_BOLD = '\u{001b}[0m: '

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View any player\'s stats from any CONECORP game!')

        .addStringOption(option => option
            .setName('username')
            .setDescription('Username of the player whose data you want to view.')
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
        let username = interaction.options.getString('username');
        let gameName = interaction.options.getString('game');

        let placeInfo = places[gameName];
        let userData = await getUserInfo(client, username);

        if (!userData) {
            await errorEmbed(interaction, 'Failed to fetch data for ' + username + '.')
            return;
        }

        let saveFile = await getSaveData(client, placeInfo, userData.id);
        let gameIcon = await getGameIcon(client, placeInfo.place);
        let userHeadshot = await getUserHeadshot(client, userData.id);

        let description = ''
        let embed = new EmbedBuilder()
            .setAuthor({ name: userData.displayName + '\'s save file', iconURL: userHeadshot })
            .setColor(0x00de7a)
            .setTimestamp()
            .setFooter({ text: 'conebot by CONECORP', iconURL: gameIcon });


        if (gameName == 'sb64') {
            for (let fileNumber = 1; fileNumber <= 2; fileNumber++) {
                let saveDataThisFile = saveFile['File' + fileNumber];
                let playerPoints = (saveDataThisFile.Points.Normal || []).length;
                let goldPlayerPoints = (saveDataThisFile.Points.Gold || []).length;
                let playtime = saveDataThisFile.Playtime;

                description += '**File ' + fileNumber + '**```ansi';
                description += START_BOLD + 'Player Points' + END_BOLD + playerPoints + ' + ' + goldPlayerPoints;
                description += START_BOLD + 'Playtime' + END_BOLD + playtime;
                description += '```\n'
            }

        } else if (gameName == 'sr') {
            description = ':-('
            console.log(saveFile);

        } else if (gameName == 'abj') {
            for (let fileNumber = 1; fileNumber <= 3; fileNumber++) {
                let saveDataThisFile = saveFile.Files['File' + fileNumber];
                let coins = saveDataThisFile.Coins;
                let playtimeSeconds = saveDataThisFile.Stats.Playtime;
                let powerOrbWorldNames = Object.keys(saveDataThisFile.PowerOrbs);
                let powerOrbs = 0;

                for (worldName of powerOrbWorldNames) {
                    powerOrbs += Object.keys(saveDataThisFile.PowerOrbs[worldName]).length;
                }

                description += '**File ' + fileNumber + '**```ansi';
                description += START_BOLD + 'Power Orbs' + END_BOLD + powerOrbs;
                description += START_BOLD + 'Playtime' + END_BOLD + playtimeSeconds;
                description += START_BOLD + 'Sparks' + END_BOLD + coins;
                description += '```\n'
            }
        }

        embed.setDescription(description);

        await interaction.reply({ embeds: [embed] });
    }
}