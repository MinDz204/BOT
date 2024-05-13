const client = require("../bot");
const { ZifetchInteraction } = require("../events/Zibot/ZiFunc");
const { EmbedBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "test",
  description: "test command.",
  options: [],
  cooldown: 3,
  dm_permission: true,

  run: async (lang, interaction) => {
    const messages = await ZifetchInteraction(interaction);

    const embed = new EmbedBuilder()
      .setTitle("Test")
      .setDescription(`test`)
     
    try {
      await messages.edit({ embeds: [embed]});
    } catch (e) {
      if (interaction?.channel) {
        await interaction.channel.send({ embeds: [embed]});
      }
    }
  },
};
