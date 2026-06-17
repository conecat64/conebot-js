const { EmbedBuilder, MessageFlags, embedLength } = require('discord.js');

module.exports = async function (interaction, description, makePublic) {
    let errorEmbed = new EmbedBuilder()
        .setColor(0xff003c)
        .setTitle('Error!')
        .setDescription('`' + description + '`')
        .setTimestamp()

    if (makePublic) {
        await interaction.reply({
            embeds: [errorEmbed]
        })
    } else {
        await interaction.reply({
            embeds: [errorEmbed],
            flags: MessageFlags.Ephemeral
        })
    }
}