const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const client = require('../../bot');

const FillterRow = async (queue) => {
  const bassboost = new ButtonBuilder()
    .setLabel('Bass Boost')
    .setCustomId('Ziplayerbassboost')

  const LOFI = new ButtonBuilder()
    .setLabel('Lofi')
    .setCustomId('Ziplayerlofi')

  const nightcore = new ButtonBuilder()
    .setLabel('Nightcore')
    .setCustomId('Ziplayernightcore')

  const karaoke = new ButtonBuilder()
    .setLabel('Karaoke')
    .setCustomId('Ziplayerkaraoke')

  const Zifillteroff = new ButtonBuilder()
    .setLabel('❌')
    .setCustomId('Ziplayerfillteroff')
    .setStyle(ButtonStyle.Secondary)

  if (queue.filters.ffmpeg.isEnabled(`bassboost`)) { bassboost.setStyle(ButtonStyle.Success) } else {
    bassboost.setStyle(ButtonStyle.Secondary)
  }

  if (queue.filters.ffmpeg.isEnabled(`lofi`)) { LOFI.setStyle(ButtonStyle.Success) } else {
    LOFI.setStyle(ButtonStyle.Secondary)
  }

  if (queue.filters.ffmpeg.isEnabled(`nightcore`)) { nightcore.setStyle(ButtonStyle.Success) } else {
    nightcore.setStyle(ButtonStyle.Secondary)
  }

  if (queue.filters.ffmpeg.isEnabled(`karaoke`)) { karaoke.setStyle(ButtonStyle.Success) } else {
    karaoke.setStyle(ButtonStyle.Secondary)
  }

  return new ActionRowBuilder().addComponents(bassboost, LOFI, nightcore, karaoke, Zifillteroff);
}
const Fillter = async (user, queue, lang) => {
  let row = await FillterRow(queue)
  let embed = new EmbedBuilder()
    .setColor(lang?.COLOR || client?.color)
    .setTimestamp()
    .setTitle(`Music Filter`)
    .setDescription(`${lang?.fillter}`)
    .setFooter({ text: `${lang?.RequestBY} ${user?.tag}`, iconURL: user?.displayAvatarURL({ dynamic: true }) })
    .setImage(lang?.banner)
  return { embeds: [embed], components: [row] }
}

module.exports = { 
  ZiPlayerFillter: Fillter,
  ZiPlayerFillterRow: FillterRow }