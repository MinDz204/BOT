
const db = require("../../mongoDB");
module.exports = async (client, queue, track) => {
  console.log("ENDsong");
  await db?.ZiUserLock.deleteOne({ guildID: queue?.guild?.id, channelID: queue?.metadata?.channel?.id }).catch(e => { });
  return queue?.metadata?.Zimess?.edit({ components: [] }).catch(e => { })
  }