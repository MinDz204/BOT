const { ApplicationCommandOptionType } = require('discord.js')
module.exports = {
  name: "p",
  description: "Play/add music.",
  integration_types: [0 ,1],
  contexts: [0, 1, 2],
  options: [{
    name: "name",
    description: "Name Song",
    type: 3,
    required: true,
    autocomplete: true,
  }],
  voiceC: true,
  NODMPer: true,
  dm_permission: false,
  cooldown: 3,
  run: async (lang, interaction) => {
    const name = interaction.options.getString("name");
    return require("../events/ziplayer/ziSearch")(interaction, name);
  },
};
