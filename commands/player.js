const { zistart } = require('../events/ziplayer/ziStartTrack');
const { useMetadata, useQueue } = require("discord-player");
const { ZifetchInteraction } = require('../events/Zibot/ZiFunc');

async function Ziset(queue, lang, messages) {
  const updateMetadataWithMessage = async (message) => {
    const [getMetadata, setMetadata] = useMetadata(queue?.guild.id);
    const { channel, requestby, embedCOLOR, ZsyncedLyrics } = getMetadata();
    setMetadata({ channel, requestby, embedCOLOR, ZsyncedLyrics, Zimess: message });
  };

  try {
    const updatedMessage = await messages.edit(await zistart(queue, lang));
    await updateMetadataWithMessage(updatedMessage);
  } catch (e) {
    try {
      const newMessage = await messages.channel.send(await zistart(queue, lang));
      await updateMetadataWithMessage(newMessage);
    } catch (error) {
      console.error("Failed to update or send a message:", error);
    }
  }
}

module.exports = {
  name: "player",
  description: "Player media control",
  integration_types: [0],
  contexts: [0, 1, 2],
  options: [],
  voiceC: true,
  NODMPer: true,
  cooldown: 3,
  dm_permission: false,
  run: async (lang, interaction) => {
    try {
      const messages = await ZifetchInteraction(interaction);
      const queue = useQueue(interaction.guild.id);

      if (!queue || !queue?.metadata ) {
        await interaction.channel.send(lang?.NoPlaying);
        return;
      }

      await queue?.metadata?.Zimess?.edit({ components: [] });
      await Ziset(queue, lang, messages);
    } catch (e) {
      console.error("Error in player command:", e);
    }
  },
};
