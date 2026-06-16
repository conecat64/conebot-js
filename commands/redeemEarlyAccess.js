const { EmbedBuilder, SlashCommandBuilder, MessageFlags, Embed } = require('discord.js');
const { places, embedColors } = require('../config.json');

const getSaveData = require('../utils/getSaveData');
const getUserInfo = require('../utils/getUserInfo');
const getUserHeadshot = require('../utils/getUserHeadshot');

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
        let userInfo = await getUserInfo(client, username);
        let saveData = await getSaveData(client, gameData, userInfo.id);
        let userHeadshot = await getUserHeadshot(client, userInfo.id);

        let embed = new EmbedBuilder()
            .setTitle('Redeem Early Access')
            .setAuthor({ name: userInfo.displayName, iconURL: userHeadshot })
            .setTimestamp()

        if (!saveData) {
            let url = 'https://apis.roblox.com/cloud/v2/universes/' + gameData.universe + '/data-stores/' + gameData.datastore + '/entries?id=' + userInfo.id;
            let body = {
                value: {
                    DiscordId: interaction.member.id
                }
            };

            let response = await fetch(url, {
                method: 'POST',
                headers: client.headers,
                body: JSON.stringify(body)
            });

            embed.setDescription('**We need to first check if the username you inputted is actually you.**\nJoin [A Block\'s Journey](https://www.roblox.com/games/110541442509291/), and then run the command again.')
                .setColor(embedColors.yellow)

        } else {
            if (saveData.Verified && saveData.OwnsEarlyAccess) {
                embed.setDescription('**You\'ve successfully redeemed your Early Access!**\nYou now have permanent access to investor only channels.')
                    .setColor(embedColors.green)
            } else {
                embed.setDescription('**It looks like you don\'t own the gamepass...**\nYou can purchase it [here](https://www.roblox.com/game-pass/1507450319/Early-Access).')
                    .setColor(embedColors.red)
            }
        }

        await interaction.reply({
            embeds: [embed]
        })
    }
}