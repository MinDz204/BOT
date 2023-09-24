const { zistart } = require("./../ziplayer/ziStartTrack");
const { rank } = require("../Zibot/ZilvlSys");
module.exports = async (client, queue) => {
  let lang = await rank({ user: queue?.currentTrack?.requestby || queue?.metadata.requestby });
  if (queue?.metadata?.Zimess) return queue?.metadata?.Zimess?.edit(await zistart(queue, lang)).catch(e => { console.log(e) })
}