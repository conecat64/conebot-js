const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { https } = require('https');
const { http } = require('http');

module.exports = {
    data: new SlashCommandBuilder().setName('test').setDescription('Runs test shit.'),

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
        let saveFile = data.value.EarlyAccess;
        let message = 'You do not have early access.'
        if (saveFile) message = 'You do have early access! Yay!'

        await interaction.reply(message);

    }
}