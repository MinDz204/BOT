const config = require("../config.js");
const { REST, Routes, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const db = require("./../mongoDB")
// const mongoose = require("mongoose");
module.exports = async (client) => {
  try {
    const constextDATA1 = [
      new ContextMenuCommandBuilder()
      .setName("Play Music")
      .setType(ApplicationCommandType.Message),
    ];
    const constextDATA = [...constextDATA1,...await client.commands];
    await require("../connectMONGO")()
    const rest = new REST({ version: "10" }).setToken(config.Ziusr.keygen);
    if (config.rest){
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: await constextDATA,
    });
    console.log("Successfully loadded application [/] commands.");}
    client.errorLog = client.channels.cache.get(config?.Ziusr?.channelID) ? client.channels.cache.get(config?.Ziusr?.channelID) : undefined
    client.Zicomand = await rest.get(Routes.applicationCommands(client.user.id))
    client.user.setStatus(config.Status)
    client.user.setActivity(`${config.botStatus} /help`)
    console.log(`${client.user.tag} Bot Online!`)
  } catch (e) {
    console.log("Failed to load application [/] commands. " + e);
  }
}