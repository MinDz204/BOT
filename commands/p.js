const { ApplicationCommandOptionType } = require('discord.js')
module.exports = {
  name: "p",
  description: "Play/add music.",
  description_localizations: {
    "en-US": "Play/add music.",
    "vi": "Phát/Thêm nhạc.",  // Play/Add music in Vietnamese
    "ja": "音楽を再生/追加します", // Play/Add music in Japanese
    "ko": "음악 재생/추가합니다", // Play/Add music in Korean
  },
  integration_types: [0],
  contexts: [0, 1, 2],
  options: [{
    name: "name",
    description: "Name Song",
    name_localizations: {
      "en-US": "name",
      "vi": "tên",
      "ja": "名前",
      "ko": "이름"
    },
    description_localizations: {
      "en-US": "Name Song",
      "vi": "Tựa đề bài hát",  // Song title in Vietnamese (more accurate)
      "ja": "曲名", // Song title in Japanese
      "ko": "노래 제목" // Song title in Korean
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
