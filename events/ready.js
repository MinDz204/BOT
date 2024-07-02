const config = require("../config.js");
const {
  REST,
  Routes,
} = require("discord.js");

module.exports = async (client) => {
  try {
    const rest = new REST({ version: "10" }).setToken(config.TOKEN || process.env.TOKEN);
    // Đăng ký lệnh
    const Zicomand = await rest.put(Routes.applicationCommands(client.user.id), {
      body: await client.commands,
    });
    client.commands = Zicomand
    console.log("Successfully loaded application [/] commands.");

    client.errorLog = client.channels.cache.get(config.ZiErrChannel);

    client.user.setStatus(config.Status);
    client.user.setActivity(`${config.botStatus}`);

    console.log(`${client.user.tag} Bot Online!`);
  } catch (e) {
    console.log("Failed to load application [/] commands. " + e);
  }
}
