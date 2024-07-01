const { ShardingManager } = require('discord.js');
const config = require("./config");
const { useMainPlayer } = require('discord-player');
require('dotenv').config();

const manager = new ShardingManager('./bot.js', {
    execArgv: ['--trace-warnings'],
    token: config.TOKEN || process.env.TOKEN,
    respawn: true
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

(async () => {
    await manager.spawn().catch(console.error);

    const client = require("./bot");
    const player = useMainPlayer();
    client.on("debug", console.log)
    // player.on("debug", console.log)
    player.events.on("debug", console.log)
})()