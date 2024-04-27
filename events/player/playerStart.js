const { useMetadata } = require("discord-player");
const { EmbedBuilder, Message } = require("discord.js");
const { zistart } = require("./../ziplayer/ziStartTrack");
const { rank } = require("../Zibot/ZilvlSys");
async function Ziset(queue, lang) {
  return queue?.metadata.channel.send(await zistart(queue, lang)).then(async Message => {
    const [getMetadata, setMetadata] = useMetadata(queue?.guild.id);
    const { channel, requestby, embedCOLOR, ZsyncedLyrics } = getMetadata();
    setMetadata({ channel, requestby, embedCOLOR, ZsyncedLyrics, Zimess: Message })
  })
}
module.exports = async (client, queue) => {
  let lang = await rank({ user: queue?.currentTrack?.requestby || queue?.metadata.requestby });
  if (queue) {
    if (!queue?.metadata?.Zimess) return Ziset(queue, lang)
  }
  if(queue?.metadata?.ZsyncedLyrics?.Status) require("./../../commands/lyrics").run(lang, queue?.metadata?.Zimess, true);
  return queue?.metadata?.Zimess?.edit(await zistart(queue, lang)).catch(e => {
    return Ziset(queue, lang);
  })
}