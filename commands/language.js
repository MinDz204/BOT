const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = require('../bot');
const db = require("./../mongoDB");
const { rank } = require('../events/Zibot/ZilvlSys');
const { ZifetchInteraction } = require('../events/Zibot/ZiFunc');

module.exports = {
  name: "language",
  description: "Change bot language.",
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
    let messages = await ZifetchInteraction(interaction);

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
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`${lang?.ChangeLanguage}`)
      .setTimestamp()
      .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

    return messages?.edit({ embeds: [embed], components: [row] })
    .then(async Message => {
      setTimeout(function () {
        Message?.edit({ components: [] }).catch(console.error);
      }, 10000);
    })
    .catch(async () => {
      await interaction?.channel?.send({ embeds: [embed] })
        .then(async Message => {
          setTimeout(function () {
            Message?.edit({ components: [] }).catch(console.error);
          }, 10000);
        })
        .catch(console.error);
    });
  },
};
