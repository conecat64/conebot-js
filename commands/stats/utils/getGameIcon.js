module.exports = async function (client, place) {
    let url = 'https://thumbnails.roblox.com/v1/places/gameicons?placeIds=' + place + '&returnPolicy=PlaceHolder&size=50x50&format=Png&isCircular=false'
    let response = await fetch(url, {
        method: 'GET',
        headers: client.headers
    })

    let data = await response.json();
    return data.data[0].imageUrl;
}