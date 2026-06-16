module.exports = async function (client, userId) {
    let url = 'https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=' + userId + '&size=50x50&format=Png&isCircular=false'
    let response = await fetch(url, {
        method: 'GET',
        headers: client.headers
    })

    let data = await response.json();
    return data.data[0].imageUrl;
}