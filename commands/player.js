const { ApplicationCommandOptionType } = require('discord.js');
const { zistart } = require('../events/ziplayer/ziStartTrack');
const { useMetadata, useQueue } = require("discord-player");
const { ZifetchInteraction } = require('../events/Zibot/ZiFunc');

async function Ziset(queue, lang, messages) {
  try{
  return messages.edit(await zistart(queue, lang)).then(async Message => {
    const [getMetadata, setMetadata] = useMetadata(queue?.guild.id);
    const { channel, requestby, embedCOLOR } = getMetadata();
    setMetadata({ channel, requestby, embedCOLOR, Zimess: Message })
  })}catch(e){
    return interaction?.channel?.send(await zistart(queue, lang)).then(async Message => {
      const [getMetadata, setMetadata] = useMetadata(queue?.guild.id);
      const { channel, requestby, embedCOLOR } = getMetadata();
      setMetadata({ channel, requestby, embedCOLOR, Zimess: Message })
    }).catch(e => { })
  }
}
module.exports = {
  name: "player",
  description: "Player media control",
  options: [],
  voiceC: true,
  NODMPer: true,
  cooldown: 3,
  dm_permission: false,
  run: async (lang, interaction) => {
    let messages = await ZifetchInteraction(interaction);
    const queue = useQueue(interaction.guild.id);
    let ZiisPlaying = !!queue?.node?.isPlaying() || !queue?.isEmpty();
    if (!ZiisPlaying) return interaction.channel.send(lang?.NoPlaying).catch(e => { })
    try {
      await queue?.metadata?.Zimess?.edit({ components: [] }).catch(e => { })
    } catch (e) { }
    return Ziset(queue, lang, messages)
  },
};