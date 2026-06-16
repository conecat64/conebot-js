const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');
const { places, embedColors, emojis } = require('../config.json');

const errorEmbed = require('../utils/errorEmbed');
const getUserInfo = require('../utils/getUserInfo');
const getUserHeadshot = require('../utils/getUserHeadshot')
const getSaveData = require('../utils/getSaveData')
const getGameIcon = require('../utils/getGameIcon')
const formatTime = require('../utils/formatTime');
const { describe } = require('node:test');

const START_BOLD = '\n\u{001b}[1;2m'
const END_BOLD = '\u{001b}[0m'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View any player\'s stats from any CONECORP game!')
        .addStringOption(option => option.setName('username').setDescription('Username of the player whose data you want to view.').setRequired(true))
        .addStringOption(option => option.setName('game').setDescription('Choose a game.').setRequired(true).setChoices(
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
            await errorEmbed(interaction, 'Failed to fetch data for ' + username + '.');
            return;
        }

        let saveFile = await getSaveData(client, placeInfo, userData.id);
        let userHeadshot = await getUserHeadshot(client, userData.id);
        let gameIcon = await getGameIcon(client, gameName);

        if (!saveFile) {
            await errorEmbed(interaction, 'User has no save data attached');
            return;
        }

        let description = '';
        let embed = new EmbedBuilder()
            .setAuthor({ name: userData.displayName + '\'s ' + placeInfo.name + ' file', iconURL: userHeadshot })
            .setTitle(emojis[placeInfo.emoji] + 'View player stats')
            .setFooter({ text: 'conebot by CONECORP', iconURL: gameIcon })
            .setColor(embedColors.green)
            .setTimestamp()

        if (gameName == 'sb64') {
            for (let fileNumber = 1; fileNumber <= 2; fileNumber++) {
                let saveDataThisFile = saveFile['File' + fileNumber];
                let playerPoints = (saveDataThisFile.Points.Normal || []).length;
                let goldPlayerPoints = (saveDataThisFile.Points.Gold || []).length;
                let playtime = saveDataThisFile.Playtime;

                description += '**File ' + fileNumber + '**```ansi';
                description += START_BOLD + 'Player Points   ' + END_BOLD + playerPoints + ' + ' + goldPlayerPoints;
                description += START_BOLD + 'Playtime        ' + END_BOLD + formatTime(playtime);
                description += '```\n'
            }

        } else if (gameName == 'sr') {
            let longestMapString = -1;
            let totalMapsPlayed = 0;

            description += '**Best Times**```ansi';

            for (map of places.sr.maps) {
                let mapLength = map.display.length;
                if (mapLength > longestMapString) longestMapString = mapLength;
            }

            for (map of places.sr.maps) {
                let totalMapSpaces = longestMapString - map.display.length;
                let retrievedMapData = saveFile.Stats.Maps[map.id];
                let bestTime = formatTime(retrievedMapData.BestTime, true);
                let playedAmount = retrievedMapData.TimesPlayed;
                let mapSpacesString = '  '
                let pluralConcat = 's'

                totalMapsPlayed += playedAmount;

                if (playedAmount == 1) {
                    pluralConcat = '';
                }

                for (let i = 0; i < totalMapSpaces; i++) {
                    mapSpacesString += ' ';
                }

                if (retrievedMapData.BestTime == -1) {
                    bestTime = '???    '
                }

                description += START_BOLD + map.display + END_BOLD + mapSpacesString + bestTime + ' / ' + playedAmount.toLocaleString('en-US') + ' time' + pluralConcat;
            }

            description += '```\n'

            description += '**Other Stats**```ansi';
            description += START_BOLD + 'Playtime            ' + END_BOLD + formatTime(saveFile.Stats.General.Playtime);
            description += START_BOLD + 'Gems                ' + END_BOLD + saveFile.Collectibles.Gems.toLocaleString('en-US');
            description += START_BOLD + 'Deaths              ' + END_BOLD + saveFile.Stats.General.Deaths.toLocaleString('en-US');
            description += START_BOLD + 'Win Streak          ' + END_BOLD + saveFile.Stats.General.HighestWinStreak.toLocaleString('en-US');
            description += START_BOLD + 'Rounds Completed    ' + END_BOLD + saveFile.Stats.General.RoundsCompleted.toLocaleString('en-US');
            description += START_BOLD + 'Total Maps Played   ' + END_BOLD + totalMapsPlayed.toLocaleString('en-US');
            description += '```'

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
                description += START_BOLD + 'Power Orbs   ' + END_BOLD + powerOrbs;
                description += START_BOLD + 'Playtime     ' + END_BOLD + formatTime(playtimeSeconds);
                description += START_BOLD + 'Sparks       ' + END_BOLD + coins.toLocaleString('en-US');
                description += '```\n'
            }
        }

        embed.setDescription(description);

        await interaction.reply({ embeds: [embed] });
    }
}