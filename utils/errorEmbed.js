const { EmbedBuilder, MessageFlags, embedLength } = require('discord.js');

module.exports = async function (interaction, description, makePublic, error) {
    if (!interaction) return;
    
    let errorEmbed = new EmbedBuilder()
        .setColor(0xff003c)
        .setTitle('Error!')
        .setDescription('`' + description + '`')
        .setTimestamp()

    if (description.toString().indexOf("DiscordAPIError[10062]") != -1) return;

    await interaction.reply({
        embeds: [errorEmbed],
        flags: (makePublic) ? undefined : MessageFlags.Ephemeral
    })
}