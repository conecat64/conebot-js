module.exports = async function (client, gameData, userId) {
    let url = 'https://apis.roblox.com/cloud/v2/universes/' + gameData.universe + '/data-stores/' + gameData.datastore + '/entries/' + userId;
    let response = await fetch(url, {
        headers: client.headers
    });

    let data = await response.json();
    let saveFile = data.value;

    return saveFile;
}