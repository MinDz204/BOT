const { ShardingManager } = require('discord.js');
const config = require("./config");

(async () => {
  await require("./connectMONGO")()
  const manager = new ShardingManager('./bot.js', {
    execArgv: ['--trace-warnings'],
    token: config.Ziusr.keygen,
    respawn: true
  });
  manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
  manager.spawn().catch(console.error);
})()
