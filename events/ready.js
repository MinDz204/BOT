const config = require("../config.js");
const {
  REST,
  Routes,
} = require("discord.js");
const db = require("../mongoDB.js");
// const mongoose = require("mongoose");
module.exports = async (client) => {
  try {
    // Kết nối MongoDB
    await require("../connectMONGO.js")();
    const rest = new REST({ version: "10" }).setToken(config.Ziusr.keygen);
    // Đăng ký lệnh
    if (config.rest) {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: await client.commands,
      });
      console.log("Successfully loaded application [/] commands.");
    }
    const errorChannelId = config.Ziusr?.channelID;
    client.errorLog = client.channels.cache.get(errorChannelId);

    client.Zicomand = await rest.get(
      Routes.applicationCommands(client.user.id),
    );
    client.user.setStatus(config.Status);
    client.user.setActivity(`${config.botStatus} /help`);

    console.log(`${client.user.tag} Bot Online!`);
  } catch (e) {
    console.log("Failed to load application [/] commands. " + e);
  }
};
