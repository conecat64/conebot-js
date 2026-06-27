const { EmbedBuilder, SlashCommandBuilder, MessageFlags, Embed } = require('discord.js');
const { places, embedColors, emojis, modRoles } = require('../config.json');

const getSaveData = require('../utils/getSaveData');
const getUserInfo = require('../utils/getUserInfo');
const errorEmbed = require('../utils/errorEmbed');
const getUserHeadshot = require('../utils/getUserHeadshot');

module.exports = {
    moderatorOnly: true,

    data: new SlashCommandBuilder()
        .setName('gift-early-access')
        .setDescription('Gifts ABJ early access to a user.')

        .addStringOption(option => option
            .setName('username')
            .setDescription('The target\'s username.')
            .setRequired(true)
        ),

    async execute(interaction) {
        let client = interaction.client;
        let member = interaction.member;
        let username = interaction.options.getString('username');
        let user = member.user;
        let gameData = places.abj;

        let userInfo = await getUserInfo(client, username);

        if (!userInfo) {
            errorEmbed(interaction, 'Failed to fetch data for ' + username + '.');
            return;
        }

        let saveData = await getSaveData(client, gameData, userInfo.id);

        if (!saveData) {
            errorEmbed(interaction, 'User has no save data.');
            return;
        }

        if (saveData.EarlyAccess == true) {
            errorEmbed(interaction, 'User already has Early Access.', true);
            return;
        }

        saveData.EarlyAccess = true;

        let url = 'https://apis.roblox.com/cloud/v2/universes/' + gameData.universe + '/data-stores/' + gameData.datastore + '/entries/' + userInfo.id;
        let body = { value: saveData };

        let userHeadshot = await getUserHeadshot(client, userInfo.id);
        let embed = new EmbedBuilder()
            .setTitle(emojis.robux + 'Gift Early Access')
            .setFooter({ text: 'conebot by CONECORP', iconURL: user.displayAvatarURL() })
            .setAuthor({ name: 'Enjoy, ' + userInfo.displayName + '!', iconURL: userHeadshot })
            .setDescription(emojis.travelerguy + 'Successfully gifted Early Access to **' + userInfo.displayName + '** (@' + userInfo.name + ')')
            .setColor(embedColors.green)
            .setTimestamp()

        let response = await fetch(url, {
            method: 'PATCH',
            headers: client.headers,
            body: JSON.stringify(body)
        });

        await interaction.reply({
            embeds: [embed]
        })
    }
}