const { places } = require('../config.json');

module.exports = async function (client, gameName) {
    let place = places[gameName].place;
    let url = 'https://thumbnails.roblox.com/v1/places/gameicons?placeIds=' + place + '&returnPolicy=PlaceHolder&size=50x50&format=Png&isCircular=false'
    let response = await fetch(url, {
        method: 'GET',
        headers: client.headers
    })

    let data = await response.json();
    return data.data[0].imageUrl;
}