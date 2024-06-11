const client = require("../bot");
const { ZifetchInteraction } = require("../events/Zibot/ZiFunc");
const { EmbedBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");


module.exports = {
  name: "test",
  description: "test command.",
  integration_types: [0 ,1],
  contexts: [0, 1, 2],
  options: [],
  cooldown: 3,
  dm_permission: true,

  run: async (lang, interaction) => {
    const player = useMainPlayer();
    console.log(player.scanDeps())
  },
};
