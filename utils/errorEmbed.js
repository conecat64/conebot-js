const { EmbedBuilder, MessageFlags, embedLength } = require('discord.js');

module.exports = async function (interaction, description, makePublic) {
    let errorEmbed = new EmbedBuilder()
        .setColor(0xff003c)
        .setTitle('Error!')
        .setDescription('`' + description + '`')
        .setTimestamp()

    await interaction.reply({
        embeds: [errorEmbed],
        flags: (makePublic) ? undefined : MessageFlags.Ephemeral
    })
}