const config = require("../config.js");
const {
  REST,
  Routes,
} = require("discord.js");
const db = require("../mongoDB.js");
const mongoose = require("mongoose");

module.exports = async (client) => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(config.MOGOURL || process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => console.log(`Connected MongoDB`)).catch((err) => {
      return console.log("\nMongoDB Error: \n" + err)
    })

    const rest = new REST({ version: "10" }).setToken(config.TOKEN || process.env.TOKEN);
    // Đăng ký lệnh
    if (config.rest) {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: await client.commands,
      });
      console.log("Successfully loaded application [/] commands.");
    }

    client.errorLog = client.channels.cache.get(config.ZiErrChannel);

    client.Zicomand = await rest.get(
      Routes.applicationCommands(client.user.id),
    );
    client.user.setStatus(config.Status);
    client.user.setActivity(`${config.botStatus}`);

    console.log(`${client.user.tag} Bot Online!`);
  } catch (e) {
    console.log("Failed to load application [/] commands. " + e);
  }
}
