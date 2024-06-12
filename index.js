const { ShardingManager } = require('discord.js');
const config = require("./config");
require('dotenv').config();

const manager = new ShardingManager('./bot.js', {
  execArgv: ['--trace-warnings'],
  token: config.TOKEN || process.env.TOKEN,
  respawn: true
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn().catch(console.error);
