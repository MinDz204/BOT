const { useMainPlayer, useQueue, useMetadata } = require('discord-player');
const db = require("./../mongoDB")
function isNumber(str) {
  return /^[0-9]+$/.test(str);
}
module.exports = async (client, msg) => {
  if (!msg.content) return;
  console.log(`${msg.content}`)
  let content = msg.content?.toLowerCase()
  if (content?.includes("play") || content?.includes("phát")) {

    const player = useMainPlayer();
    const [getMetadata] = useMetadata(msg.channel.guild.id);
    const { channel, requestby, embedCOLOR } = getMetadata();
    const queue = useQueue(msg.channel.guild.id)
    try {
      const nameSearch = content?.replace("play", "").replace("phát", "").replace("bài hát", "");
      console.log(nameSearch)
      const results = await player.search(nameSearch, {
        fallbackSearchEngine: "youtube"
      });
      let userddd = await db.ZiUser.findOne({ userID: msg?.author?.id }).catch(e => { })
      await player.play(msg.channel.id, results, {
        nodeOptions: {
          metadata: {
            channel: channel,
            requestby: msg?.author,
            embedCOLOR: embedCOLOR,
          },
          requestedBy: msg?.author,
          volume: userddd?.vol || 50,
          maxSize: 200,
          maxHistorySize: 20,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 2000,
          leaveOnEnd: false,
          skipOnNoStream: true,
          selfDeaf: false,
        }
      });
      return require("./player/playerStart")(client, queue);
    } catch (e) { console.log(e) }
  }
  if (content?.includes("bỏ qua bài hát")) {
    const queue = useQueue(msg.channel.guild.id)
    if (queue.repeatMode == 1) queue?.setRepeatMode(QueueRepeatMode.QUEUE)
    return queue?.node?.skip()
  }
  if (content?.includes("volume") || content.includes("âm lượng")) {
    const queue = useQueue(msg.channel.guild.id)
    const vol = content?.match(/\d+/);
    if (!isNumber(vol[0])) return;
    let volume = vol[0] > 100 ? 100 : vol[0];
    queue.node.setVolume(Math.abs(volume))
    await db.ZiUser.updateOne({ userID: msg?.author?.id }, {
      $set: {
        vol: Math.abs(volume),
      }
    }, { upsert: true })
    return require("./player/playerStart")(client, queue);
  }
  if (content?.includes("tiếp")) {
    const queue = useQueue(msg.channel.guild.id)
    try { await queue?.node?.play() } catch (e) { console.log(e) }
    return require("./player/playerStart")(client, queue);
  }
}