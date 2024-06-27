const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = require('../bot');
const db = require("./../mongoDB");
const { rank } = require('../events/Zibot/ZilvlSys');
const { ZifetchInteraction } = require('../events/Zibot/ZiFunc');

module.exports = {
  name: "language",
  description: "Change bot language.",
  name_localizations: {
    "en-US": "language",
    "vi": "ngôn-ngữ",
    "ja": "言語",  // Language in Japanese
    "ko": "언어"   // Language in Korean
  },
  description_localizations: {
    "en-US": "Change bot language.",
    "vi": "Thay đổi ngôn ngữ bot.",
    "ja": "ボットの言語を変更する",  // Change bot language in Japanese
    "ko": "봇 언어 변경"   // Change bot language in Korean
  },
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [{
    name: "name",
    description: "Name language",
    type: 3,
    required: true,
    choices: [
      { "name": 'Tiếng Việt', "value": 'vi' },
      { "name": 'English', "value": 'en' },
      { "name": 'Japanese', "value": 'jp' },
      { "name": 'Korean', "value": 'ko' },
      { "name": 'China (Simplified)', "value": 'zh' },
    ]
  }],
  cooldown: 10,
  dm_permission: true,
  run: async (langOld, interaction) => {
    await ZifetchInteraction(interaction);

    const name = interaction.options.getString("name");
    await db.ZiUser.updateOne({ userID: interaction?.user?.id }, {
      $set: {
        userN: interaction?.user?.tag,
        lang: name,
      }
    }, { upsert: true }).catch(e => { })
    let lang = await rank({ user: interaction?.user });
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("❌")
        .setStyle(ButtonStyle.Secondary)
    )

    const embed = new EmbedBuilder()
      .setColor(lang.COLOR || client.color)
      .setImage(lang?.banner)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`${lang?.ChangeLanguage}`)
      .setTimestamp()
      .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    if (!interaction.guild) return interaction.editReply({ content: "", embeds: [embed] });
    return interaction.editReply({ embeds: [embed], components: [row] })
      .then(async Message => {
        setTimeout(function () {
          Message?.edit({ content: "", components: [] }).catch(console.error);
        }, 10000);
      })
      .catch(async () => {
        await interaction?.user?.send({ embeds: [embed] })
          .then(async Message => {
            setTimeout(function () {
              Message?.edit({ components: [] }).catch(console.error);
            }, 10000);
          })
          .catch(console.error);
      });
  },
};
