const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const translate = require('@iamtraction/google-translate');
const ISO6391 = require('iso-639-1');
const client = require('../bot');
const { ZifetchInteraction } = require('../events/Zibot/ZiFunc');

module.exports = {
    name: "Translate",
    name_localizations: {
      "en-US": "Translate",
      "vi": "dịch",
      "ja": "翻訳",
      "ko": "번역"
    },
    integration_types: [0 ,1],
    contexts: [0, 1, 2],
    NODMPer: false,
    dm_permission: true,
    cooldown: 3,
};
  
module.exports.run = async (lang, interaction) => {
    return require("./../commands/translate").run(lang, interaction);
  }
