const client = require("../bot");
const { ZifetchInteraction } = require("../events/Zibot/ZiFunc");
const { EmbedBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { generateOauthTokens, YoutubeiExtractor } = require("discord-player-youtubei");
const { useMainPlayer } = require("discord-player");
const player = useMainPlayer();

module.exports = {
  name: "tests",
  description: "test command.",
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [],
  cooldown: 3,
  dm_permission: true,

  run: async (lang, interaction) => {
    const key = await generateOauthTokens()
    console.log(key)

  },
};
