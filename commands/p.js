const { ApplicationCommandOptionType } = require('discord.js')
module.exports = {
  name: "p",
  description: "Play/add music.",
  description_localizations: {
    "en-US": "Play/add music.",
    "vi": "Phát/Thêm nhạc.",
    "ja": "音楽を再生/追加します",
    "ko": "음악 재생/추가합니다",
  },
  integration_types: [0],
  contexts: [0, 1, 2],
  options: [{
    name: "name",
    description: "Name Song",
    description_localizations: {
      "en-US": "Name Song",
      "vi": "Tựa đề bài hát",
      "ja": "曲名",
      "ko": "노래 제목"
    },
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
