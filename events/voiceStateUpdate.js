const { EmbedBuilder } = require("discord.js");
const db = require("../mongoDB");
const { useQueue } = require('discord-player');

module.exports = async (client, oldState, newState) => {
  const queue = useQueue(oldState.guild.id);
  if (queue || queue?.node.isPlaying()) {
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