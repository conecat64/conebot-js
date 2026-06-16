const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');
const { places, embedColors } = require('../config.json');

const getGameIcon = require('../utils/getGameIcon');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('links')
        .setDescription('Gives specific links on a specific game.')
        .addStringOption(option => option.setName('game').setDescription('Choose a game.').setRequired(true).setChoices(
            { name: 'SUPER BLOX 64!', value: 'sb64' },
            { name: 'Superstar Racers', value: 'sr' },
            { name: 'A Block\'s Journey', value: 'abj' }
        )
        ),

    async execute(interaction) {
        let client = interaction.client;
        let user = interaction.member.user;
        let gameName = interaction.options.getString('game');
        let gameData = places[gameName];

        let gameIcon = await getGameIcon(client, gameName);

        let embed = new EmbedBuilder()
            .setAuthor({ name: gameData.name, iconURL: gameIcon })
            .setTitle('Game information')
            .setFooter({ text: 'conebot by CONECORP', iconURL: user.displayAvatarURL() })
            .setColor(embedColors.green)
            .setTimestamp()

        if (gameName == 'sb64') {
            embed.addFields(
                { name: 'Main Links', value: '[Play](https://www.roblox.com/games/15644138782)\n[Wiki](https://sb64.conecorp.cc)\n[Speedruns](https://www.speedrun.com/SUPER_BLOX_64)\n[Soundtrack](https://soundcloud.com/conecat64/sets/super-blox-64)' },
                { name: 'Archives', value: '[Pre-recode](https://www.roblox.com/games/100107837169770)' }
            )
        } else if (gameName == 'sr') {
            embed.addFields(
                { name: 'Main Links', value: '[Play](https://www.roblox.com/games/18238180555)\n[Wiki](https://sr.conecorp.cc/)\n[Speedruns](https://www.speedrun.com/Superstar_Racers)\n[Soundtrack](https://soundcloud.com/conecat64/sets/superstar-racers)' },
                { name: 'Archives', value: '[Recode 1](https://www.roblox.com/games/95040976261571/) (Up until Sodacan Canyon)\n[Recode 2](https://www.roblox.com/games/98448869903123/) (Up until Jungle Underpass)\n[Recode 3](https://www.roblox.com/games/79619063818727/) (Up until Mountain Monastery)' }
            )
        } else if (gameName == 'abj') {
            embed.addFields(
                { name: 'Main Links', value: '[Play](https://www.roblox.com/games/110541442509291)\n[Wiki](https://abj.conecorp.cc)\n[Speedruns](https://www.speedrun.com/A_Blocks_Journey)\n[Soundtrack](https://soundcloud.com/conecat64/sets/a-blocks-journey-soundtrack)' },
                { name: 'Other Links', value: '[Early Access](https://www.roblox.com/game-pass/1507450319)\n[SB64J](https://www.roblox.com/games/90207978377481) (April Fool\'s 2026)' }
            )
        }

        await interaction.reply({ embeds: [embed] });
    }
}