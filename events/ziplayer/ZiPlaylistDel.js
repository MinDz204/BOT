// interaction.customId.split('_')[2]
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const db = require("./../../mongoDB");
const client = require('../../bot');


module.exports = async (interaction, lang) => {
  const listname = interaction.customId.split('_')[1]
  const idss = interaction.customId.split('_')[2]
  if (interaction.user.id != idss) return interaction.reply({
    content: "",
    embeds: [
      new EmbedBuilder()
        .setColor(lang?.COLOR || client.color)
        .setDescription(`❌ | Bạn Không sở hữu ${listname}`)
        .setTimestamp()
        .setFooter({ text: `${lang?.RequestBY} ${interaction.user?.tag}`, iconURL: interaction.user?.displayAvatarURL({ dynamic: true }) })
        .setImage(lang?.banner)
    ],
    ephemeral: true
  })
  suss = await db.playlist.deleteOne({ userID: idss, listname })
  if (suss) {
    interaction?.message?.delete().catch(e => { })
    interaction.reply({
      content: "",
      embeds: [
        new EmbedBuilder()
          .setColor(lang?.COLOR || client.color)
          .setDescription(`✅ | Success delete ${listname}`)
          .setTimestamp()
          .setFooter({ text: `${lang?.RequestBY} ${interaction.user?.tag}`, iconURL: interaction.user?.displayAvatarURL({ dynamic: true }) })
          .setImage(lang?.banner)
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("❌")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("ZiPlaylistDel")
            .setEmoji("<:trash:1151572367961764000>")
            .setStyle(ButtonStyle.Secondary),
        )
      ]
    })
  }
  return;
}