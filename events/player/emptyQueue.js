const { zistart } = require("./../ziplayer/ziStartTrack");
const { rank } = require("../Zibot/ZilvlSys");
const db = require("../../mongoDB");
module.exports = async (client, queue) => {
  await db?.ZiUserLock.deleteOne({ guildID: queue?.guild?.id, channelID: queue?.metadata?.channel?.id }).catch(e => { });
  let lang = await rank({ user: queue?.currentTrack?.requestby || queue?.metadata.requestby });
  if (queue?.metadata?.Zimess) return queue?.metadata?.Zimess?.edit(await zistart(queue, lang)).catch(e => { console.log(e) })
}