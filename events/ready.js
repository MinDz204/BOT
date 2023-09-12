const config = require("../config.js");
const { ActivityType, EmbedBuilder } = require("discord.js")
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const mongoose = require("mongoose");
module.exports = async (client) => {
  mongoose.set('strictQuery', true)
  mongoose.connect(config.MOGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(console.log("connected MONGODB"))
  console.log(`${client.user.tag} Bot Online!`)

  client.user.setStatus(config.Status)
  client.user.setActivity(config.botStatus)

  const rest = new REST({ version: "10" }).setToken(config.token);
  (async () => {
    try {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: await client.commands,
      });
      console.log("Successfully loadded application [/] commands.");
      client.errorLog = client.channels.cache.get(config.errorLog) ? client.channels.cache.get(config.errorLog) : undefined
//del db
      client.Zicomand = await rest.get(Routes.applicationCommands(client.user.id))
      setTimeout(async()=>{
        const db = require("./../mongoDB");
        await db.Ziqueue.deleteOne();
      },5000)

    } catch (e) {
      console.log("Failed to load application [/] commands. " + e);
    }
  })();

}
