const { EmbedBuilder } = require("discord.js");
const { tracsrowslecs } = require("../Zibot/ZiFunc");
const { rank } = require("../Zibot/ZilvlSys");
module.exports = async (client, queue, tracks, done) => {
  let request = queue?.currentTrack?.requestby || queue?.metadata.requestby;
  let lang = await rank({ user: request });
  code = await tracsrowslecs(tracks, lang, "Play next:", request);
  return queue?.metadata?.channel?.send( code ).then(async Message => {
    setTimeout(async function() {
    await queue?.metadata?.channel?.messages.fetch({ message: Message.id , cache: false, force: true })
    .then( mess =>{
      mess.delete();
      done(tracks[0]);
    })
    .catch(e => { })
    }, 15000)
  }).catch(e => { console.log(e) })
}