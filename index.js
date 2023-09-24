const { ShardingManager } = require('discord.js');
const config = require("./config");

(async()=>{ 
await require("./connectMONGO")()
const manager = new ShardingManager('./bot.js', { token: config.Ziusr.keygen });
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();
})()
