const { EmbedBuilder } = require("discord.js");
const db = require("../mongoDB");
const { useQueue } = require('discord-player');
const config = require("../config");

async function Ziset(queue, requestby) {
  const { useMetadata } = require("discord-player");
  const { rank } = require("./Zibot/ZilvlSys");
  const { zistart } = require("./ziplayer/ziStartTrack");
  const [getMetadata, setMetadata] = useMetadata(queue?.guild.id);
  const { channel, embedCOLOR, Zimess } = getMetadata();
  setMetadata({ channel, requestby, embedCOLOR, Zimess });
  await db.ZiUserLock.deleteOne({ guildID: queue?.guild?.id, channelID: queue?.metadata?.channel?.id }).catch(e => { });
  let lang = await rank({ user: queue?.currentTrack?.requestby || queue?.metadata.requestby });
  if (queue && !queue?.metadata?.Zimess) return;
  return queue?.metadata?.Zimess?.edit(await zistart(queue, lang)).catch(e => { })
}

module.exports = async (client, oldState, newState) => {
  const queue = useQueue(oldState?.guild?.id);
  if (queue || queue?.node.isPlaying()) {
    let botChannel = oldState?.guild?.channels?.cache?.get(queue?.dispatcher?.voiceConnection?.joinConfig?.channelId)
    if (botChannel) {
      if (botChannel.id == oldState.channelId) {
        if (!botChannel?.members?.find(x => x == queue?.metadata?.requestby?.id)) {
          if (botChannel?.members?.size > 1) {
            const members = oldState.channel?.members
              .filter((m) => !m.user.bot)
              .map((m) => m.id);
            let randomID = members[Math.floor(Math.random() * members.length)];
            let randomMember = oldState?.guild.members.cache.get(randomID);
            return Ziset(queue, randomMember.user);
          }
        }
      }
    }
    if (newState.id === client.user.id) {
      let lang = await db?.ZiUser?.findOne({ userID: queue?.currentTrack?.requestby?.id || queue?.metadata?.requestby?.id })
      lang = lang?.lang || `vi`
      lang = require(`../lang/${lang}.js`);

      if (oldState.serverMute === false && newState.serverMute === true) {
        if (queue?.metadata) {
          const embed = new EmbedBuilder()
            .setColor(`#ff0000`)
            .setDescription(`${lang.SeverMute}`);
          queue?.node?.pause();
          await queue?.metadata?.channel?.send({ content: ``, embeds: [embed] }).catch(e => { })
        }
      }
      if (oldState.serverMute === true && newState.serverMute === false) {
        if (queue?.metadata) {
          const embed = new EmbedBuilder()
            .setColor(lang?.COLOR || client.color)
            .setDescription(`${lang.SeverUnMute}`)
          queue?.node?.resume();
          await queue?.metadata?.channel?.send({ content: ``, embeds: [embed] }).catch(e => { })
        }
      }
    }
  }

}