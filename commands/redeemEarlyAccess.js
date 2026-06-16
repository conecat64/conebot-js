const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');
const { places } = require('../config.json');

const getSaveData = require('../utils/getSaveData');
const getUserInfo = require('../utils/getUserInfo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('redeem-early-access')
        .setDescription('Gives you the ABJ Early Access role, ONLY if you own the gamepass.')

        .addStringOption(option => option
            .setName('username')
            .setDescription('Your username.')
            .setRequired(true)
        ),

    async execute(interaction) {
        let client = interaction.client;
        let gameData = places.verification;

        let username = interaction.options.getString('username');
        username = 'conecat64';
        let userInfo = await getUserInfo(client, username);
        let saveData = await getSaveData(client, gameData, userInfo.id);

        if (!saveData) {
            let url = 'https://apis.roblox.com/cloud/v2/universes/' + gameData.universe + '/data-stores/' + gameData.datastore + '/entries?id=' + userInfo.id;
            let body = {
                value: {
                    DiscordId: interaction.member.id,
                    LastUpdatedTick: Date.now() / 1000
                }
            };

            let response = await fetch(url, {
                method: 'POST',
                headers: client.headers,
                body: JSON.stringify(body)
            });

        } else {
            if (saveData.Verified && saveData.OwnsEarlyAccess) {
                await interaction.reply({
                    embeds: [ redeemedEmbed ]
                })
                return;
            }
        }
    }
}