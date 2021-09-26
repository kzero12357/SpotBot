const fetch = require("node-fetch")

module.exports.run = async (client , message, args) => {
fetch(`https://api.botlist.space/v1/bots/${client.user.id}`, {
method: "POST",
headers: {
Authorization: "d0db5c98d8934c7071283a5af30c26b170323e0f9f5d958d49e8f292b174ed566cc939dd87411acd2609b12a1cedac97",
"Content-Type": "application/json"
},
body: JSON.stringify({server_count: client.guilds.cache.size, shards: client.shard.count}),
}).then(response => response.text())
fetch(`https://space-bot-list.xyz/api/bots/${client.user.id}`, {
method: "POST",
headers: {
Authorization: "sW8LsU8KalPJVsFX1B9o4cNgGDL2pEOz19yKcpWl4opEFgG-3y",
"Content-Type": "application/json"
},
body: JSON.stringify({guilds: client.guilds.cache.size, users: client.users.cache.size}),
}).then(response => response.text())
fetch(`https://glennbotlist.xyz/api/bot/${client.user.id}/stats`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': "XA-1f937d294889434ebaf2cec1c847e24e"
        },
        body: JSON.stringify({serverCount: client.guilds.cache.size, shardCount: client.shard.count})
    }).then(res => res.json())
    const shards = client.shard.count;
    const servers = await client.shard.broadcastEval('this.guilds.cache.size').then(x => x.reduce((a, b) => b + a));
tbl.PostStats(servers, shards)
message.channel.send("✅ Success posted stats to all sites!")
}

module.exports.help = {
    name: "poststats",
    category: "owner",
    aliases: ['ps'],
    description: "Post stats to all sites!",
    example: "``poststats``"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ["EMBED_LINKS"],
    ownerOnly: true
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}