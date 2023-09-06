const { ApplicationCommandOptionType } = require('discord.js')
module.exports = {
  name: "p",
  description: "Play music.",
  options: [{
    name: "name",
    description: "Tên bài hát",
    type: 3,
    required: true,
  }],
  voiceC: true,
  NODMPer: true,

  run: async (client, interaction) => {
    const name = interaction.options.getString("name");
    return require("../events/ziplayer/ziSearch")(client, interaction, name);

  },
};
