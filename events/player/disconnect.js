
const db = require("../../mongoDB");
module.exports = async (client, queue, track) => {
  await db?.ZiUserLock.deleteOne({ guildID: queue?.guild?.id, channelID: queue?.metadata?.channel?.id }).catch(e => { });
  return queue?.metadata?.Zimess?.edit({ components: [] }).catch(e => { })
  }