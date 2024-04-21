const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const client = require('../../bot');

const createButton = (label, customId) => {
  return new ButtonBuilder()
    .setLabel(label)
    .setCustomId(customId)
    .setStyle(ButtonStyle.Secondary);
};

const FillterRow = async (queue) => {
  const buttonConfigs = [
    { label: 'Bass Boost', id: 'Ziplayerbassboost' },
    { label: 'Lofi', id: 'Ziplayerlofi' },
    { label: 'Nightcore', id: 'Ziplayernightcore' },
    { label: 'Karaoke', id: 'Ziplayerkaraoke' },
    { label: '❌', id: 'Ziplayerfillteroff', style: ButtonStyle.Secondary },
  ];

  const buttons = buttonConfigs.map((config) => {
    const button = createButton(config.label, config.id);
    if (queue.filters.ffmpeg.isEnabled(config.id.substring(8).toLowerCase())) {
      button.setStyle(ButtonStyle.Success);
    }
    return button;
  });

  return new ActionRowBuilder().addComponents(...buttons);
};

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