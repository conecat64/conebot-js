const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { https } = require('https');
const { http } = require('http');

module.exports = {
    data: new SlashCommandBuilder().setName('test').setDescription('Runs test shit.'),

    async execute(interaction) {
        let universe = '7813156957'
        let datastore = 'ABJData'
        let id = '1557046556'

        let url = 'https://apis.roblox.com/cloud/v2/universes/' + universe + '/data-stores/' + datastore + '/entries/' + id;
        let response = await fetch(url, {
            'x-api-key': process.env.API_KEY,
            'Content-Type': 'application/json'
        });
        
        let data = await response.json();

        console.log(data);
    }
}