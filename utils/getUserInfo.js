const { Client } = require('discord.js');

module.exports = async function(client, username) {
    let url = 'https://users.roblox.com/v1/usernames/users'
    let body = {
        usernames: [ username ],
        excludeBannedUsers: true
    }

    let response = await fetch(url, {
        method: 'POST',
        headers: client.headers,
        body: JSON.stringify(body)
    })

    let data = await response.json();
    return data.data[0];
}