const { EmbedBuilder, SlashCommandBuilder, MessageFlags, Embed } = require('discord.js');
const { places, embedColors, emojis } = require('../config.json');

const getSaveData = require('../utils/getSaveData');
const getUserInfo = require('../utils/getUserInfo');
const errorEmbed = require('../utils/errorEmbed');
const getUserHeadshot = require('../utils/getUserHeadshot');
const { error } = require('node:console');

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
        let member = interaction.member;
        let user = member.user;
        let gameData = places.verification;
        let alreadyHasRole = member.roles.cache.some(role => role.id === places.abj.role);

        if (alreadyHasRole) {
            errorEmbed(interaction, 'You already have the role');
            return;
        }

        let username = interaction.options.getString('username');
        let userInfo = await getUserInfo(client, username);

        if (!userInfo) {
            errorEmbed(interaction, 'Failed to fetch data for ' + username + '.');
            return;
        }

        let saveData = await getSaveData(client, gameData, userInfo.id);
        let userHeadshot = await getUserHeadshot(client, userInfo.id);

        let embed = new EmbedBuilder()
            .setTitle(emojis.robux + 'Redeem Early Access')
            .setFooter({ text: 'conebot by CONECORP', iconURL: user.displayAvatarURL() })
            .setAuthor({ name: userInfo.displayName, iconURL: userHeadshot })
            .setTimestamp()

        if (!saveData) {
            let url = 'https://apis.roblox.com/cloud/v2/universes/' + gameData.universe + '/data-stores/' + gameData.datastore + '/entries?id=' + userInfo.id;
            let body = {
                value: {
                    DiscordId: user.id,
                    DiscordUsername: user.username
                }
            };

            let response = await fetch(url, {
                method: 'POST',
                headers: client.headers,
                body: JSON.stringify(body)
            });

            embed.setDescription(emojis.what + '**We need to first check if the username you inputted is actually you.**\n1. Join [A Block\'s Journey](https://www.roblox.com/games/110541442509291/) on the inputted account\n2. Run the command again')
                .setColor(embedColors.yellow)

        } else {
            if (saveData.Verified && saveData.OwnsEarlyAccess) {
                if (saveData.DiscordId != user.id) {
                    embed.setDescription('**Leech.**')
                        .setColor(embedColors.red)

                } else {
                    let role = member.guild.roles.cache.find(role => role.id === places.abj.role);
                    member.roles.add(role);

                    embed.setDescription(emojis.yes + '**You\'ve successfully redeemed your Early Access!**\nYou now have permanent access to investor only channels.\n' + emojis.eyes + '**Check them out!**\n<#1465073243915419670>\n<#1465073798389698600>')
                        .setColor(embedColors.green)
                }

            } else if (!saveData.Verified) {
                embed.setDescription(emojis.what + '**Seems like your verification process is still pending.**\nJoin [A Block\'s Journey](https://www.roblox.com/games/110541442509291/) on the inputted account, and then run the command again.')
                    .setColor(embedColors.yellow)

            } else if (saveData.Verified && !saveData.OwnsEarlyAccess) {
                embed.setDescription(emojis.no + '**It looks like you don\'t own the gamepass...**\nYou can purchase it [here](https://www.roblox.com/game-pass/1507450319/Early-Access).')
                    .setColor(embedColors.red)

            } else {
                embed.setDescription(emojis.no + '**You really shouldn\'t be seeing this...**\nHow did you do this?')
                    .setColor(embedColors.red)
            }
        }

        await interaction.reply({
            embeds: [embed]
        })
    }
}