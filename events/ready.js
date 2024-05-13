const config = require("../config.js");
const {
  REST,
  Routes,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require("discord.js");
const db = require("../mongoDB.js");
// const mongoose = require("mongoose");
module.exports = async (client) => {
  try {
    // Khởi tạo mảng các lệnh context menu
    const contextMenuCommands = [
      new ContextMenuCommandBuilder()
        .setName("Play Music")
        .setType(ApplicationCommandType.Message),
      new ContextMenuCommandBuilder()
        .setName("Translate")
        .setType(ApplicationCommandType.Message),
    ];

    const allCommands = [...contextMenuCommands, ...(await client.commands)];
    // Kết nối MongoDB
    await require("../connectMONGO.js")();
    const rest = new REST({ version: "10" }).setToken(config.Ziusr.keygen);
    // Đăng ký lệnh context menu
    if (config.rest) {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: allCommands,
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
