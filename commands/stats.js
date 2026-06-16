const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { https } = require('https');
const { http } = require('http');

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
                { name: 'Superstar Racers', value: 'sr' },
                { name: 'A Block\'s Journey', value: 'abj' }
            )
        ),

    async execute(interaction) {
        let client = interaction.client;
        let universe = '7813156957'
        let datastore = 'ABJData'
        let id = '1557046556'

        let url = 'https://apis.roblox.com/cloud/v2/universes/' + universe + '/data-stores/' + datastore + '/entries/' + id;
        let response = await fetch(url, {
            headers: client.headers
        });

        let data = await response.json();
        let saveFile = data.value;
        let message = ''

        for (let fileNumber = 1; fileNumber <= 3; fileNumber++) {
            let saveDataThisFile = saveFile.Files['File' + fileNumber];
            let coins = saveDataThisFile.Coins;
            let playtimeSeconds = saveDataThisFile.Stats.Playtime;
            let powerOrbWorldNames = Object.keys(saveDataThisFile.PowerOrbs);
            let powerOrbs = 0;

            for (worldName of powerOrbWorldNames) {
                powerOrbs += Object.keys(saveDataThisFile.PowerOrbs[worldName]).length;
            }

            message += '**File ' + fileNumber + '**```ansi';
            message += START_BOLD + 'Power Orbs' + END_BOLD + powerOrbs;
            message += START_BOLD + 'Playtime' + END_BOLD + playtimeSeconds;
            message += START_BOLD + 'Sparks' + END_BOLD + coins;
            message += '```\n'
        }

        await interaction.reply(message);
    }
}