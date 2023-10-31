const config = require("../config.js");
const { REST, Routes } = require('discord.js');
const db = require("./../mongoDB")
// const mongoose = require("mongoose");
module.exports = async (client) => {
  try {
    await require("../connectMONGO")()
    const rest = new REST({ version: "10" }).setToken(config.Ziusr.keygen);
    if (config.rest){
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: await client.commands,
    });
    console.log("Successfully loadded application [/] commands.");}
    client.errorLog = client.channels.cache.get(config?.Ziusr?.channelID) ? client.channels.cache.get(config?.Ziusr?.channelID) : undefined
    client.Zicomand = await rest.get(Routes.applicationCommands(client.user.id))
    client.user.setStatus(config.Status)
    client.user.setActivity(`${config.botStatus} shard #${Number(client?.shard?.ids) + 1 ? Number(client?.shard?.ids) + 1 : "1"}`)
    console.log(`${client.user.tag} Bot Online!`)
  } catch (e) {
    console.log("Failed to load application [/] commands. " + e);
  }
}
