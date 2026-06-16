const { places } = require('../config.json');

module.exports = async function(client, game, scriptContent) {
    let gameInfo = places[game]
    let universe = gameInfo.universe;
    let place = gameInfo.place;

    let url = 'https://apis.roblox.com/cloud/v2/universes/' + universe + '/places/' + place + '/luau-execution-session-tasks'
    let body = {
        script: scriptContent
    }

    let request = await fetch(url, {
        method: 'POST',
        headers: client.headers,
        body: JSON.stringify(body)
    })
}